import React, { memo, useEffect, useState } from "react";
import { useSettingsStore } from "../store";
import { useInterval } from "../utils";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { clamp } from "three/src/math/MathUtils";
import Battery from "./Battery";
import Slider from "./Slider";
import ToggleBtn from "./ToggleBtn";
import { useAudio } from "../utils";
import bgMusic from "../audio/background.mp3";
import mobileIcons from "../images/mobile_icon.png";
import exitSound from "../audio/shutdown.mp3";
import gitHubImg from "../images/github.png";
import linkedInImg from "../images/linkedIn.png";
import restartImg from "../images/restart.png";
import shutdownImg from "../images/shutdown.png";

const MobileTaskbar = memo(() => {
  const {
    brightness,
    setBrightness,
    use3D,
    set3D,
    useStatic,
    setStatic,
    scanlines,
    setScanlines,
    useFlicker,
    setFlicker,
    volume,
    setVolume,
    fancyText,
    setFancyText,
    lightModeText,
    lightMode,
    setLightMode,
    fullscreen,
    setFullscreen,
    initFullscreen,
    restart,
    shutdown,
  } = useSettingsStore((state) => state);

  const [playBg, pauseBg] = useAudio(bgMusic, 0.5, true);
  const [playShutdown] = useAudio(exitSound, 0.3);

  const settingsReveal = useMotionValue(0);

  const [now, setNow] = useState<Date>();
  useInterval(() => setNow(new Date()), 1000);

  const [battery, setBattery] = useState(1);
  useEffect(() => {
    setVolume(0);
    initFullscreen();

    if (!("getBattery" in navigator))
      return setBattery(Math.max(Math.random(), 0.001));
    let batteryRef: any, updateBattery: Function;
    //@ts-ignore
    navigator.getBattery().then((batt) => {
      batteryRef = batt;
      updateBattery = () => setBattery(batt.level);
      batt.addEventListener("levelchange", updateBattery);
      updateBattery();
    });
    return () => batteryRef?.removeEventListener("levelchange", updateBattery);
  }, []);

  return (
    <>
      <motion.div
        style={{
          opacity: settingsReveal,
          pointerEvents: useTransform(settingsReveal, (val) =>
            val == 0 ? "none" : "auto",
          ),
        }}
        className="fixed top-0 z-40 h-full w-full touch-none bg-black-primary/75 p-4 pt-12 text-white-primary backdrop-blur-lg short:pb-12 short:pt-16"
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => {
          document.documentElement.classList.add("cursor-grab");
          document.body.classList.add("pointer-events-none");
        }}
        onDrag={(_e, info) =>
          settingsReveal.set(
            clamp(1 + info.offset.y / window.innerHeight, 0, 1),
          )
        }
        onDragEnd={() => {
          document.documentElement.classList.remove("cursor-grab");
          document.body.classList.remove("pointer-events-none");
          animate(settingsReveal, settingsReveal.get() > 0.65 ? 1 : 0);
        }}
      >
        <motion.div
          className="grid h-full grid-cols-2 gap-4"
          style={{
            y: useTransform(settingsReveal, (val) => `${(1 - val) * -100}%`),
            gridTemplateRows: "auto repeat(5, 1fr) auto auto",
          }}
        >
          <div className="flex justify-end gap-4 short:col-span-2">
            <a
              href="https://www.linkedin.com/in/reda-elmountassir"
              target="_blank"
              className="cursor-pointer"
            >
              <img
                src={linkedInImg}
                alt="LinkedIn Logo"
                width="24"
                height="24"
              />
            </a>
            <a
              href="https://github.com/redaelmountassir"
              target="_blank"
              className="cursor-pointer"
            >
              <img src={gitHubImg} alt="GitHub Logo" width="24" height="24" />
            </a>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => restart()}
            >
              <img
                src={restartImg}
                alt="restart symbol"
                width="24"
                height="24"
              />
            </button>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                shutdown();
                pauseBg();
                playShutdown();
              }}
            >
              <img
                src={shutdownImg}
                alt="shutdown symbol"
                width="24"
                height="24"
              />
            </button>
          </div>
          <h3 className="col-start-1 row-start-1 font-bold short:col-span-2 short:row-start-auto short:my-5 short:font-display short:text-5xl short:font-normal average:my-6 average:text-7xl tall:my-10">
            {now?.toLocaleDateString([], {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </h3>
          <ToggleBtn setter={set3D} state={use3D}>
            3D Background
          </ToggleBtn>
          <ToggleBtn setter={setStatic} state={useStatic}>
            Static
          </ToggleBtn>
          <ToggleBtn setter={setScanlines} state={scanlines}>
            Scanlines
          </ToggleBtn>
          <ToggleBtn setter={setFlicker} state={useFlicker}>
            Flicker
          </ToggleBtn>
          <ToggleBtn setter={setLightMode} state={lightMode}>
            {lightModeText}
          </ToggleBtn>
          <ToggleBtn setter={setFancyText} state={fancyText}>
            Fancy Text
          </ToggleBtn>
          <ToggleBtn setter={setFullscreen} state={fullscreen}>
            Fullscreen
          </ToggleBtn>
          <Slider
            noMargin
            className="col-span-2 my-0 mt-6 average:my-2 average:mt-8 tall:my-4 tall:mt-12"
            state={brightness}
            setter={setBrightness}
            purpose="Brightness"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -0.5 16 16"
              shapeRendering="crispEdges"
            >
              <path
                className="stroke-white-primary transition"
                d="M7 4h2M5 5h2M9 5h2M5 6h1M10 6h1M4 7h1M11 7h1M4 8h1M11 8h1M5 9h1M10 9h1M5 10h2M9 10h2M7 11h2"
              />
              {[
                "M11 0h1M10 1h1M10 2h1",
                "M15 4h1M13 5h2",
                "M13 10h2M15 11h1",
                "M10 13h1M10 14h1M11 15h1",
                "M5 13h1M5 14h1M4 15h1",
                "M1 10h2M0 11h1",
                "M0 4h1M1 5h2",
                "M4 0h1M5 1h1M5 2h1",
              ].map((path, i, arr) => (
                <path
                  key={path}
                  className={`origin-center scale-0 stroke-transparent transition ${
                    brightness >= ((arr.length - i) / arr.length) * 100 &&
                    "scale-100! stroke-white-primary!"
                  }`}
                  d={path}
                />
              ))}
            </svg>
          </Slider>
          <Slider
            noMargin
            state={volume}
            setter={(val: number) => {
              setVolume(val);
              playBg();
            }}
            purpose="Volume"
            className="col-span-2 my-0 average:my-2 tall:my-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -0.5 16 16"
              shapeRendering="crispEdges"
            >
              <path
                className="stroke-white-primary"
                d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
              />
              <path
                className={`-translate-x-1 stroke-transparent transition ${
                  volume > 0 && "translate-x-0! stroke-white-primary!"
                }`}
                d="M9 6h1M10 7h1M10 8h1M9 9h1"
              />
              <path
                className={`-translate-x-1 stroke-transparent transition ${
                  volume > 33.3 && "translate-x-0! stroke-white-primary!"
                }`}
                d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
              />
              <path
                className={`-translate-x-1 stroke-transparent transition ${
                  volume > 66.6 && "translate-x-0! stroke-white-primary!"
                }`}
                d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
              />
              <path
                className={`stroke-transparent transition ${
                  volume == 0 && "stroke-white-primary!"
                }`}
                d="M11 6h1M15 6h1M12 7h1M14 7h1M13 8h1M12 9h1M14 9h1M11 10h1M15 10h1"
              />
            </svg>
          </Slider>
        </motion.div>
      </motion.div>
      <motion.div
        style={{
          pointerEvents: useTransform(settingsReveal, (val) =>
            val == 1 ? "none" : "auto",
          ),
        }}
        className="fixed top-0 z-40 flex w-full cursor-grab touch-none items-center gap-2 p-2 px-4 text-white-primary short:p-4"
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => {
          document.documentElement.classList.add("cursor-grab");
          document.body.classList.add("pointer-events-none");
        }}
        onDrag={(_e, info) =>
          settingsReveal.set(clamp(info.offset.y / window.innerHeight, 0, 1))
        }
        onDragEnd={() => {
          document.documentElement.classList.remove("cursor-grab");
          document.body.classList.remove("pointer-events-none");
          animate(settingsReveal, settingsReveal.get() > 0.35 ? 1 : 0);
        }}
      >
        <p>
          {now?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) ?? "Loading..."}
        </p>
        <img
          src={mobileIcons}
          alt="Mobile icons"
          className="ml-auto h-4"
          height="16"
          width="36"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -0.5 16 16"
          shapeRendering="crispEdges"
          className="h-5"
        >
          <path
            className="stroke-white-primary"
            d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
          />
          <path
            className={`-translate-x-1 stroke-transparent transition ${
              volume > 0 && "translate-x-0! stroke-white-primary!"
            }`}
            d="M9 6h1M10 7h1M10 8h1M9 9h1"
          />
          <path
            className={`-translate-x-1 stroke-transparent transition ${
              volume > 33.3 && "translate-x-0! stroke-white-primary!"
            }`}
            d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
          />
          <path
            className={`-translate-x-1 stroke-transparent transition ${
              volume > 66.6 && "translate-x-0! stroke-white-primary!"
            }`}
            d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
          />
          <path
            className={`stroke-transparent transition ${
              volume == 0 && "stroke-white-primary!"
            }`}
            d="M11 6h1M15 6h1M12 7h1M14 7h1M13 8h1M12 9h1M14 9h1M11 10h1M15 10h1"
          />
        </svg>
        <p>{Math.floor(battery * 100)}%</p>
        <Battery level={battery} className="h-6" />
      </motion.div>
    </>
  );
});

export default MobileTaskbar;
