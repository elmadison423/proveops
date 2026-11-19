"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

export default function ActionsMenu({
  meterId,
  meterTag,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const menuRef = useRef(null);
  const triggerRef = useRef(null);

 function openMenu() {
  if (!triggerRef.current) return;

  const rect =
    triggerRef.current.getBoundingClientRect();

  const menuWidth = 190;
  const menuHeight = 190;
  const spacing = 8;

  let left =
    rect.right - menuWidth;

  let top =
    rect.bottom + spacing;

  // Keep menu inside the left side of the screen
  if (left < 8) {
    left = 8;
  }

  // Keep menu inside the right side of the screen
  if (
    left + menuWidth >
    window.innerWidth - 8
  ) {
    left =
      window.innerWidth -
      menuWidth -
      8;
  }

  // If there isn't enough room below the button,
  // open the menu above the button instead.
  if (
    top + menuHeight >
    window.innerHeight - 8
  ) {
    top =
      rect.top -
      menuHeight -
      spacing;
  }

  // Final safety check for the top of the screen
  if (top < 8) {
    top = 8;
  }

  setPosition({
    top,
    left,
  });

  setOpen(true);
}

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current &&
        triggerRef.current.contains(event.target)
      ) {
        return;
      }

      if (
        menuRef.current &&
        menuRef.current.contains(event.target)
      ) {
        return;
      }

      setOpen(false);
    }

    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );
    };
  }, []);

  const dropdown = open
    ? createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: "190px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "6px",
            boxShadow:
              "0 15px 35px rgba(0,0,0,0.20)",
            zIndex: 999999,
          }}
        >

          <Link
            href={`/meter-detail?id=${meterId}`}
            onClick={closeMenu}
            style={{
              display: "block",
              textDecoration: "none",
            }}
          >
            <div className="menu-item">
              👁 View Meter
            </div>
          </Link>

          <Link
            href={`/edit-meter?id=${meterTag}`}
            onClick={closeMenu}
            style={{
              display: "block",
              textDecoration: "none",
            }}
          >
            <div className="menu-item">
              ✏ Edit Meter
            </div>
          </Link>

          <Link
            href={`/log-prove?id=${meterId}`}
            onClick={closeMenu}
            style={{
              display: "block",
              textDecoration: "none",
            }}
          >
            <div className="menu-item">
              📝 Log Prove
            </div>
          </Link>

          <hr
            style={{
              border: "none",
              borderTop:
                "1px solid #e2e8f0",
              margin: "6px 0",
            }}
          />

          <button
  type="button"
  className="menu-item danger"
  onClick={() => {
    closeMenu();
    onDelete();
  }}
>
  📦 Archive Meter
</button>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="actions-trigger"
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        ⋮
      </button>

      {dropdown}
    </>
  );
}