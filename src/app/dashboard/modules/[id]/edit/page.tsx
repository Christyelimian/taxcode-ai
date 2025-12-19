import EditModuleClient from "./edit-module-client";

export default function EditModulePage({ params }: { params: { id: string } }) {
  return <EditModuleClient moduleId={params.id} />;
}
