import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import AlertMessage from "./AlertMessage";

interface ReservationProps {
    room: {
        data: {
            id: string;
            attributes: {
                title: string;
                price: number;
            };
        };
    };
    isUserAuthenticated: boolean;
    userData: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
    } | null;
}

const postData = async (url: string, data: object) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(data),
    };

    const res = await fetch(url, options);
    const responseData = await res.json();

    if (!res.ok) {
        throw new Error(responseData?.error?.message || "Failed to post data");
    }
    return responseData;
};

const Reservation: React.FC<ReservationProps> = ({ room, isUserAuthenticated, userData }) => {
    const [checkInDate, setCheckInDate] = useState<Date | undefined>();
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        type: "error" | "success";
    } | null>(null);

    const formatDateForStrapi = (date: Date) => format(date, "yyyy-MM-dd");

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (alertMessage) {
            timer = setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [alertMessage]);

    const saveReservation = async () => {
        if (!isUserAuthenticated) {
            setAlertMessage({
                message: "Please log in to make a reservation.",
                type: "error",
            });
            return;
        }

        if (!checkInDate || !checkOutDate) {
            setAlertMessage({
                message: "Please select check-in and check-out dates",
                type: "error",
            });
            return;
        }

        if (!userData) {
            setAlertMessage({
                message: "User data is not available",
                type: "error",
            });
            return;
        }

        const data = {
            data: {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                checkIn: formatDateForStrapi(checkInDate),
                checkOut: formatDateForStrapi(checkOutDate),
                room: room.data.id,
            },
        };

        try {
            const response = await postData("http://localhost:1337/api/reservations", data);
            console.log("Reservation Response:", response);

            setAlertMessage({
                message: "Your booking has been successfully confirmed!",
                type: "success",
            });

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 3000);
        } catch (error) {
            console.error("Reservation error:", error);
            setAlertMessage({
                message: "Failed to make reservation. Please try again.",
                type: "error",
            });
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Book your room</h2>
            <div className="flex flex-col gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!checkInDate && "text-muted-foreground"}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "MMMM dd, yyyy") : "Check In"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                        />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!checkOutDate && "text-muted-foreground"}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "MMMM dd, yyyy") : "Check Out"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                            disabled={(date) =>
                                date < new Date() ||
                                (checkInDate ? date <= checkInDate : false)
                            }
                        />
                    </PopoverContent>
                </Popover>
                <Button 
                    onClick={isUserAuthenticated ? saveReservation : () => window.location.href = "/dashboard"} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                    Book Now
                </Button>
            </div>
            {alertMessage && (
                <AlertMessage
                    message={alertMessage.message}
                    type={alertMessage.type}
                />
            )}
        </div>
    );
};

export default Reservation;