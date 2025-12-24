'use client';

import { useEffect, useState } from "react";

export default function SplashLoader({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) {
      const prevBody = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("splash-lock");
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.classList.remove("splash-lock");
      };
    }
  }, [showContent]);

  return (
    <>
      <div className={`splash ${showContent ? "splash--hidden" : ""}`}>
        <div className="loader">
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>
          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>
        <div className="longfazers">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="splash__text">
          <p className="splash__eyebrow">The Happy Safar</p>
        </div>
      </div>
      {showContent && <div className="splash__content">{children}</div>}

      <style jsx>{`
        .splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #fff;
          --loader-color: #f97316;
          --loader-accent: #fb923c;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }

        .splash--hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .loader {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -50px;
          animation: speeder 0.4s linear infinite;
        }

        .loader > span {
          height: 5px;
          width: 35px;
          background: var(--loader-color);
          position: absolute;
          top: -19px;
          left: 60px;
          border-radius: 2px 10px 1px 0;
        }

        .base span {
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 100px solid var(--loader-color);
          border-bottom: 6px solid transparent;
        }

        .base span:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: var(--loader-color);
          position: absolute;
          right: -110px;
          top: -16px;
        }

        .base span:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid var(--loader-color);
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
        }

        .face {
          position: absolute;
          height: 12px;
          width: 20px;
          background: var(--loader-color);
          border-radius: 20px 20px 0 0;
          transform: rotate(-40deg);
          right: -125px;
          top: -15px;
        }

        .face:after {
          content: "";
          height: 12px;
          width: 12px;
          background: var(--loader-accent);
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
        }

        .loader > span > span:nth-child(1),
        .loader > span > span:nth-child(2),
        .loader > span > span:nth-child(3),
        .loader > span > span:nth-child(4) {
          width: 30px;
          height: 1px;
          background: var(--loader-accent);
          position: absolute;
          animation: fazer1 0.2s linear infinite;
        }

        .loader > span > span:nth-child(2) {
          top: 3px;
          animation: fazer2 0.4s linear infinite;
        }

        .loader > span > span:nth-child(3) {
          top: 1px;
          animation: fazer3 0.4s linear infinite;
          animation-delay: -1s;
        }

        .loader > span > span:nth-child(4) {
          top: 4px;
          animation: fazer4 1s linear infinite;
          animation-delay: -1s;
        }

        @keyframes fazer1 {
          0% {
            left: 0;
          }
          100% {
            left: -80px;
            opacity: 0;
          }
        }

        @keyframes fazer2 {
          0% {
            left: 0;
          }
          100% {
            left: -100px;
            opacity: 0;
          }
        }

        @keyframes fazer3 {
          0% {
            left: 0;
          }
          100% {
            left: -50px;
            opacity: 0;
          }
        }

        @keyframes fazer4 {
          0% {
            left: 0;
          }
          100% {
            left: -150px;
            opacity: 0;
          }
        }

        @keyframes speeder {
          0% {
            transform: translate(2px, 1px) rotate(0deg);
          }
          10% {
            transform: translate(-1px, -3px) rotate(-1deg);
          }
          20% {
            transform: translate(-2px, 0px) rotate(1deg);
          }
          30% {
            transform: translate(1px, 2px) rotate(0deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-1px, 3px) rotate(-1deg);
          }
          60% {
            transform: translate(-1px, 1px) rotate(0deg);
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg);
          }
          80% {
            transform: translate(-2px, -1px) rotate(1deg);
          }
          90% {
            transform: translate(2px, 1px) rotate(0deg);
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg);
          }
        }

        .longfazers {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .longfazers span {
          position: absolute;
          height: 2px;
          width: 20%;
          background: linear-gradient(90deg, var(--loader-accent), transparent);
        }

        .longfazers span:nth-child(1) {
          top: 20%;
          animation: lf 0.6s linear infinite;
          animation-delay: -5s;
        }

        .longfazers span:nth-child(2) {
          top: 40%;
          animation: lf2 0.8s linear infinite;
          animation-delay: -1s;
        }

        .longfazers span:nth-child(3) {
          top: 60%;
          animation: lf3 0.6s linear infinite;
        }

        .longfazers span:nth-child(4) {
          top: 80%;
          animation: lf4 0.5s linear infinite;
          animation-delay: -3s;
        }

        @keyframes lf {
          0% {
            left: 200%;
          }
          100% {
            left: -200%;
            opacity: 0;
          }
        }

        @keyframes lf2 {
          0% {
            left: 200%;
          }
          100% {
            left: -200%;
            opacity: 0;
          }
        }

        @keyframes lf3 {
          0% {
            left: 200%;
          }
          100% {
            left: -100%;
            opacity: 0;
          }
        }

        @keyframes lf4 {
          0% {
            left: 200%;
          }
          100% {
            left: -100%;
            opacity: 0;
          }
        }

        .splash__text {
          position: absolute;
          top: 65%;
          left: 50%;
          transform: translate(-50%, 0);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: var(--loader-color);
          font-weight: 600;
          font-size: 0.75rem;
          overflow: hidden;
        }

        .splash__eyebrow,
        .splash__tagline {
          display: inline-block;
          animation: text-swipe 1.4s ease forwards;
        }

        .splash__tagline {
          margin-top: 0.75rem;
          letter-spacing: 0.25em;
          font-size: 0.65rem;
          color: #ea580c;
          animation-delay: 0.15s;
        }

        @keyframes text-swipe {
          0% {
            transform: translateX(120%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            transform: translateX(-20%);
            opacity: 1;
          }
          100% {
            transform: translateX(-120%);
            opacity: 0;
          }
        }

        .splash__content {
          opacity: 0;
          animation: content-fade 0.6s ease forwards;
        }

        @keyframes content-fade {
          to {
            opacity: 1;
          }
        }

        :global(html.splash-lock) {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
