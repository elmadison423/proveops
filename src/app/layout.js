import './globals.css'

import Link from 'next/link'

export const metadata = {

  title: 'ProveOps',

  description:
    'Meter proving software',
}

export default function RootLayout({
  children,
}) {

  return (

    <html lang="en">

      <body>

        <nav>

          <Link
            href="/"
            style={{
              color: 'white',
              marginRight:
                '20px',
              textDecoration:
                'none',
            }}
          >

            Dashboard

          </Link>

          <Link
            href="/meters"
            style={{
              color: 'white',
              marginRight:
                '20px',
              textDecoration:
                'none',
            }}
          >

            Meters

          </Link>

          <Link
            href="/history"
            style={{
              color: 'white',
              marginRight:
                '20px',
              textDecoration:
                'none',
            }}
          >

            History

          </Link>

          <Link
            href="/add-meter"
            style={{
              color: 'white',
              marginRight:
                '20px',
              textDecoration:
                'none',
            }}
          >

            Add Meter

          </Link>

          <Link
            href="/add-company"
            style={{
              color: 'white',
              marginRight:
                '20px',
              textDecoration:
                'none',
            }}
          >

            Add Company

          </Link>

          <Link
            href="/add-technician"
            style={{
              color: 'white',
              marginRight:
                '20px',
              textDecoration:
                'none',
            }}
          >

            Add Technician

          </Link>
<Link
  href="/technician-dashboard"
  style={{
    color: 'white',
    marginRight: '20px',
    textDecoration: 'none',
  }}
>

  Technician Dashboard
</Link>
          <Link
            href="/login"
            style={{
              color: 'white',
              marginLeft:
                '20px',
              textDecoration:
                'none',
            }}
          >

            Logout

          </Link>

        </nav>

        <div>
          {children}
        </div>

      </body>

    </html>
  )
}