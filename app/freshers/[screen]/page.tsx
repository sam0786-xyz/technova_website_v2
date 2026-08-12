import { FreshersExperience, type FreshersPage } from "../freshers-experience";

const knownPages = new Set<FreshersPage>([
  "start", "orientation", "passport", "quest", "toolkit", "campus", "find-your-thing",
  "clubs", "community", "technova", "feedback", "credential", "help", "admin",
]);

export default async function FreshersScreen({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  return <FreshersExperience page={knownPages.has(screen as FreshersPage) ? screen as FreshersPage : "orientation"} />;
}
