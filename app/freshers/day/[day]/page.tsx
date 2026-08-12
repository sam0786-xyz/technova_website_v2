import { FreshersExperience } from "../../freshers-experience";

export default async function FreshersDay({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  return <FreshersExperience page="day" day={Number(day)} />;
}
