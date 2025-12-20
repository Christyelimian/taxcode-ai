import SettingsClientPage from './settings-client-page';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage all platform settings, environment variables, backups, and configurations
        </p>
      </div>
      <SettingsClientPage />
    </div>
  );
}

