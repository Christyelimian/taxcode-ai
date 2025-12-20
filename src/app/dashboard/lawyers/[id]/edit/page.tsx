import EditLawyerClient from "./edit-lawyer-client";

export default async function EditLawyerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditLawyerClient lawyerId={id} />;
}


