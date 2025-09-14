"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay"; // ✅ add autoplay CSS
import { Navigation, Autoplay } from "swiper/modules"; // ✅ import Autoplay

export default function MySlider() {
  const slides = [
    { img: "/images/1.jpg",  },
    { img: "/images/2.jpg",  },
    { img: "/images/3.jpg",  },
    { img: "/images/4.jpg", },
    { img: "/images/5.jpg", },
    { img: "/images/6.jpg",  },
    { img: "/images/7.jpg", },
    { img: "/images/8.jpg",  },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]} // ✅ add autoplay
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000, // 3 seconds between slides
          disableOnInteraction: false, // keep autoplay after user interaction
        }}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[400px]">
              <img
                style={{ width: "100%", height: "100%" }}
                src={slide.img}
                alt="loading..."
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
