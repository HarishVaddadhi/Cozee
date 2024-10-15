"use client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import { AlertDialog, AlertDialogAction , AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "./ui/alert-dialog";

const deleteData = async (url: string) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error('Failed to delete reservation.');
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

const postData = async (url: string, data: object) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error('Failed to post reservation.');
    }
    return await res.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
};



const CancelReservation = ({ reservation }: { reservation: any }) => {
  const router = useRouter();

  const handleCancelReservation = async (id: number) => {
    await deleteData(`http://localhost:1337/api/reservations/${id}`);
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="default">Cancel Reservation</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>Canceling this reservation will result in a loss of any deposits made.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Dismiss</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleCancelReservation(reservation.id)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export default CancelReservation;