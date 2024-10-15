import React from "react";
import RoomList from "./RoomList";

const getRooms = async () => {
    try {
        const res = await fetch("http://localhost:1337/api/rooms?populate=*", {
            next: {
                revalidate: 0,
            },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched Rooms Data:", JSON.stringify(data, null, 2)); // Log the entire response
        return data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return { data: [] }; // Return an empty structure on error
    }
};


const Rooms = async () => {
    const rooms = await getRooms();
    console.log(rooms);
    return (
        <section>
            <div className="container mx-auto">
                <RoomList rooms={rooms} />
                </div>
        </section>
    )
}

export default Rooms