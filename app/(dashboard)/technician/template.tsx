import { TechnicianAuthCheck } from "./TechnicianAuthCheck";

export default async function TechnicianTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  await TechnicianAuthCheck();
  return <>{children}</>;
}
