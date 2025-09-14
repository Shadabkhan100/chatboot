"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function MySlider() {
  const slides = [
    {
      img: "/images/1.jpg",
      text: "Delicious Burgers",
    },
    {
      img: "/images/2.jpg",
      text: "Spicy Pizza",
    },
    {
      img: "/images/3.jpg",
      text: "Fresh Salads",
    },
    {
      img: "/images/4.jpg",
      text: "Fresh Salads",
    },
    {
      img: "/images/5.jpg",
      text: "Fresh Salads",
    },
    {
      img: "/images/6.jpg",
      text: "Fresh Salads",
    },
    {
      img: "/images/7.jpg",
      text: "Fresh Salads",
    },
    {
      img: "/images/8.jpg",
      text: "Fresh Salads",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Swiper
        navigation={true}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[400px]">
              {/* Image */}
              <img
              style={{width:"100%",height:"100%"}}
                src={slide.img}
                alt={slide.text}
                className="w-full h-full object-cover"
              />

              {/* Black Overlay */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold">
                  {slide.text}
                </h2>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
