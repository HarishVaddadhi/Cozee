"use client";

import Image from 'next/image';
import { TbArrowsMaximize, TbUsers } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import Reservation from '@/components/Reservation';

interface Room {
  data: {
    id: string;
    attributes: {
      title: string;
      price: number;
      size: number;
      capacity: number;
      description: string;
      image: {
        data: {
          attributes: {
            url: string;
          };
        };
      };
    };
  };
}

const RoomDetails = ({ params }: { params: { id: string } }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRoomData = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/rooms/${params.id}?populate=*`, {
        next: { revalidate: 0 },
      });
      const data = await res.json();
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room data:', error);
      // Consider setting an error state here to inform the user
    }
  };

  useEffect(() => {
    getRoomData();

    // Check authentication status
    const token = localStorage.getItem('authToken');
    setIsUserAuthenticated(!!token);
  }, [getRoomData, params.id]);

  if (!room) return <div>Loading...</div>;

  const imgURL = `http://localhost:1337${room.data.attributes.image.data.attributes.url}`;

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:gap-12 h-full">
          <div className="flex-1">
            <div className="relative h-[360px] lg:h-[420px] mb-8">
              <Image src={imgURL} fill className="object-cover" alt="Room image" />
            </div>
            <div className="flex flex-1 flex-col mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3>{room.data.attributes.title}</h3>
                <p className="h3 font-secondary font-medium text-accent">
                  ${room.data.attributes.price}
                  <span className="text-base text-secondary">/ night</span>
                </p>
              </div>
              <div className="flex items-center gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-2xl text-accent">
                    <TbArrowsMaximize />
                  </div>
                  <p>{room.data.attributes.size} m<sup>2</sup></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl text-accent">
                    <TbUsers />
                  </div>
                  <p>{room.data.attributes.capacity} Guests</p>
                </div>
              </div>
              <p>{room.data.attributes.description}</p>
            </div>
          </div>
          <div className="w-full lg:max-w-[360px] h-max">
            <Reservation
              room={room}
              isUserAuthenticated={isUserAuthenticated} userData={null}            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;