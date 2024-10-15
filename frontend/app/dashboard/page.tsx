import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CancelReservation from "@/components/CancelReservation";

const getUserReservations = async (userEmail: string) => {
  try {
    const response = await fetch(
      `http://localhost:1337/api/reservations?[filters][email][$eq]=${userEmail}&populate=*`,
      {
        next: {
          revalidate: 0,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch reservations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return { data: [] }; // Return an empty array if there's an error
  }
};

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userReservations = user?.email ? await getUserReservations(user.email) : [];
    console.log(userReservations);

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8 h-full">
        <h3 className="text-xl font-bold mb-12 border-b pb-4 text-center lg:text-left">My Bookings</h3>
        <div>
          {userReservations?.data?.length < 1 ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <p className="text-xl text-center text-secondary/70 mb-4">You don’t have any reservations.</p>
              {/* back to Homepage button  */}
              <Link href="/">
              <Button size="default">Go to Homepage</Button>
              </Link>
            </div>
          ) : (
            userReservations.data.map((reservation: any) => (
              <div key={reservation.id} className="bg-tertiary py-8 px-12">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <h3 className="text-2xl font-medium text-center lg:text-left">
                    {reservation.attributes.room?.data?.attributes?.title || "Room Title"}
                  </h3>
                  <div className="flex flex-col lg:flex-row gap-2 lg:w-[100px]">
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-accent font-bold uppercase tracking-[2px]">From:</span>
                      <span className="text-secondary font-semibold">
                        {reservation.attributes.checkIn
                          ? format(new Date(reservation.attributes.checkIn), "PPP")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-accent font-bold uppercase tracking-[2px]">To:</span>
                      <span className="text-secondary font-semibold">
                        {reservation.attributes.checkOut
                          ? format(new Date(reservation.attributes.checkOut), "PPP")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <CancelReservation reservation={reservation} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
