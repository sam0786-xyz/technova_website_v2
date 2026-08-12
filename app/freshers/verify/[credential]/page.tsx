import { FreshersExperience } from "../../freshers-experience";

export default async function VerifyCredential({ params }: { params: Promise<{ credential: string }> }) {
  const { credential } = await params;
  return <FreshersExperience page="verify" credential={credential} />;
}
