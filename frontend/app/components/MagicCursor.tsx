import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export default function MagicCursor() {
  const location = useLocation();
  const cursorElRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    if (typeof window === 'undefined') return;
    if (cursorElRef.current) return; // Prevent duplicate instances

    const gsap = (window as any).gsap;
    if (!gsap) {
      console.warn('GSAP not loaded, custom cursor disabled');
      return;
    }

    // Options (mirroring original defaults)
    const options = {
      container: document.body,
      speed: 0.7,
      ease: 'expo.out',
      visibleTimeout: 300,
    };

    const body = options.container;

    // Create cursor DOM (same classes as original jQuery)
    const el = document.createElement('div');
    el.className = 'cb-cursor';
    const text = document.createElement('div');
    text.className = 'cb-cursor-text';
    el.appendChild(text);
    body.appendChild(el);
    cursorElRef.current = el;

    // State (mirroring original instance properties)
    let visible = false;
    let visibleTimer: ReturnType<typeof setTimeout> | null = null;
    let pos = { x: -window.innerWidth, y: -window.innerHeight };
    let stick: { x: number; y: number } | false = false;

    const move = (x?: number, y?: number, duration?: number) => {
      gsap.to(el, {
        x: x ?? pos.x,
        y: y ?? pos.y,
        force3D: true,
        overwrite: true,
        ease: options.ease,
        duration: visible ? (duration ?? options.speed) : 0,
      });
    };

    const show = () => {
      if (visible) return;
      if (visibleTimer) clearTimeout(visibleTimer);
      el.classList.add('-visible');
      visibleTimer = setTimeout(() => {
        visible = true;
      }, options.visibleTimeout);
    };

    const hide = () => {
      if (visibleTimer) clearTimeout(visibleTimer);
      el.classList.remove('-visible');
      visibleTimer = setTimeout(() => {
        visible = false;
      }, options.visibleTimeout);
    };

    const setState = (state: string) => {
      el.classList.add(state);
    };

    const removeState = (state: string) => {
      el.classList.remove(state);
    };

    const setText = (textValue: string) => {
      text.innerHTML = textValue;
      el.classList.add('-text');
    };

    const removeText = () => {
      el.classList.remove('-text');
    };

    const setStick = (selector: string) => {
      const target = document.querySelector(selector);
      if (!target) return;
      const bound = target.getBoundingClientRect();
      stick = {
        y: bound.top + bound.height / 2,
        x: bound.left + bound.width / 2,
      };
      move(stick.x, stick.y, 5);
    };

    const removeStick = () => {
      stick = false;
    };

    const update = () => {
      move();
      show();
    };

    // --- Direct body events (same as original jQuery direct bindings) ---
    const onBodyMouseLeave = () => hide();
    const onBodyMouseEnter = () => show();
    const onBodyMouseMove = (e: MouseEvent) => {
      pos = {
        x: stick ? stick.x - ((stick.x - e.clientX) * 0.15) : e.clientX,
        y: stick ? stick.y - ((stick.y - e.clientY) * 0.15) : e.clientY,
      };
      update();
    };
    const onBodyMouseDown = () => setState('-active');
    const onBodyMouseUp = () => removeState('-active');

    body.addEventListener('mouseleave', onBodyMouseLeave);
    body.addEventListener('mouseenter', onBodyMouseEnter);
    body.addEventListener('mousemove', onBodyMouseMove);
    body.addEventListener('mousedown', onBodyMouseDown);
    body.addEventListener('mouseup', onBodyMouseUp);

    // --- Delegated hover events ---
    // Native mouseenter/mouseleave do NOT bubble, so we use mouseover/mouseout
    // with relatedTarget checks to perfectly replicate jQuery's delegation.

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const from = e.relatedTarget as Node | null;

      // a, input, textarea, button  ->  -pointer
      const interactive = target.closest('a, input, textarea, button');
      if (interactive && !interactive.contains(from)) {
        setState('-pointer');
      }

      // iframe  ->  hide
      const iframe = target.closest('iframe');
      if (iframe && !iframe.contains(from)) {
        hide();
      }

      // [data-cursor]  ->  custom state
      const dataCursor = target.closest('[data-cursor]');
      if (dataCursor && !dataCursor.contains(from)) {
        const state = (dataCursor as HTMLElement).dataset.cursor!;
        setState(state);
      }

      // [data-cursor-text]  ->  text
      const dataCursorText = target.closest('[data-cursor-text]');
      if (dataCursorText && !dataCursorText.contains(from)) {
        const textVal = (dataCursorText as HTMLElement).dataset.cursorText!;
        setText(textVal);
      }

      // [data-cursor-stick]  ->  stick
      const dataCursorStick = target.closest('[data-cursor-stick]');
      if (dataCursorStick && !dataCursorStick.contains(from)) {
        const stickVal = (dataCursorStick as HTMLElement).dataset.cursorStick!;
        setStick(stickVal);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const to = e.relatedTarget as Node | null;

      // a, input, textarea, button  ->  remove -pointer
      const interactive = target.closest('a, input, textarea, button');
      if (interactive && !interactive.contains(to)) {
        removeState('-pointer');
      }

      // iframe  ->  show
      const iframe = target.closest('iframe');
      if (iframe && !iframe.contains(to)) {
        show();
      }

      // [data-cursor]  ->  remove custom state
      const dataCursor = target.closest('[data-cursor]');
      if (dataCursor && !dataCursor.contains(to)) {
        const state = (dataCursor as HTMLElement).dataset.cursor!;
        removeState(state);
      }

      // [data-cursor-text]  ->  remove text
      const dataCursorText = target.closest('[data-cursor-text]');
      if (dataCursorText && !dataCursorText.contains(to)) {
        removeText();
      }

      // [data-cursor-stick]  ->  remove stick
      const dataCursorStick = target.closest('[data-cursor-stick]');
      if (dataCursorStick && !dataCursorStick.contains(to)) {
        removeStick();
      }
    };

    body.addEventListener('mouseover', handleMouseOver);
    body.addEventListener('mouseout', handleMouseOut);

    // Initial off-screen position
    move();

    cleanupRef.current = () => {
      body.removeEventListener('mouseleave', onBodyMouseLeave);
      body.removeEventListener('mouseenter', onBodyMouseEnter);
      body.removeEventListener('mousemove', onBodyMouseMove);
      body.removeEventListener('mousedown', onBodyMouseDown);
      body.removeEventListener('mouseup', onBodyMouseUp);
      body.removeEventListener('mouseover', handleMouseOver);
      body.removeEventListener('mouseout', handleMouseOut);
      if (visibleTimer) clearTimeout(visibleTimer);
      if (el.parentNode) el.parentNode.removeChild(el);
      cursorElRef.current = null;
    };

    return cleanupRef.current;
  }, [location.pathname]);

  return null;
}
