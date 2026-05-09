import { Resend } from 'resend'

import jsPDF from 'jspdf'

import { createClient }
from '@supabase/supabase-js'

const resend = new Resend(
  process.env.RESEND_API_KEY
)

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY
  )

export async function GET() {

  try {

    const {
      data: organizations,
    } = await supabase
      .from('Organizations')
      .select('*')

    for (
      const org
      of organizations || []
    ) {

      const {
        data: meters,
      } = await supabase
        .from('Meters')
        .select('*')
        .eq(
          'organization_id',
          org.id
        )

      const doc =
        new jsPDF()

      doc.setFontSize(20)

      doc.text(
        org.name,
        20,
        20
      )

      doc.setFontSize(16)

      doc.text(
        'Upcoming Meter Schedule',
        20,
        35
      )

      let y = 55

      let html = `
        <h1>${org.name}</h1>
        <h2>Upcoming Meter Schedule</h2>
        <ul>
      `

      ;(meters || [])
        .forEach(meter => {

          const nextDate =
            new Date(
              meter.last_prove_date
            )

          nextDate.setDate(

            nextDate.getDate()
            +
            meter.time_interval_days
          )

         doc.text(
  `${meter.name}`,
  20,
  y
)

doc.text(
  `${meter.location}`,
  90,
  y
)

doc.text(
  `${nextDate.toLocaleDateString()}`,
  160,
  y
)

          y += 12

          html += `
            <li>
              ${meter.name}
              —
              ${meter.location}
              —
              Due:
              ${nextDate.toLocaleDateString()}
            </li>
          `
        })

      html += '</ul>'

      await resend.emails.send({

        from:
          'ProveOps <onboarding@resend.dev>',

        to:
          'elmadison423@gmail.com',

        subject:
          `${org.name} Upcoming Meter Schedule`,

        html,

        attachments: [

          {
            filename:
              'meter-schedule.pdf',

            content:
              Buffer.from(
                doc.output('arraybuffer')
              ).toString('base64'),
          },
        ],
      })
    }

    return Response.json({

      success: true,
    })

  } catch (error) {

    console.log(error)

    return Response.json({

      success: false,

      error:
        error.message,
    })
  }
}