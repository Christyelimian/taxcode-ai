import EditConsultantClient from "./edit-consultant-client";

export default async function EditDirectoryProfessionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditConsultantClient consultantId={id} />;
}
