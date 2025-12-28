'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Database,
  Mail,
  Brain,
  Settings as SettingsIcon,
  Download,
  Upload,
  Key,
  Server,
  Shield,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnvVar {
  key: string;
  value: string;
  isSecret: boolean;
  description?: string;
}

interface Settings {
  envVars: EnvVar[];
  email: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  ai: {
    openaiApiKey: string;
    openrouterApiKey: string;
    defaultModel: string;
    temperature: number;
  };
  database: {
    url: string;
    backupEnabled: boolean;
    backupFrequency: string;
    lastBackup?: string;
  };
  firebase: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
  system: {
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    maxUploadSize: number;
    sessionTimeout: number;
  };
}

export default function SettingsClientPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('env');
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [isSyncingVercel, setIsSyncingVercel] = useState(false);
  const [customModelInput, setCustomModelInput] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  // Initialize custom model input when settings load
  useEffect(() => {
    if (settings?.ai?.defaultModel && !['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gemini-pro', 'gemini-ultra', 'llama-3-70b', 'llama-3-8b', 'mixtral-8x7b'].includes(settings.ai.defaultModel)) {
      setCustomModelInput(settings.ai.defaultModel);
    }
  }, [settings?.ai?.defaultModel]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        // Initialize with defaults if no settings exist
        setSettings(getDefaultSettings());
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(getDefaultSettings());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSettings = (): Settings => ({
    envVars: [
      { key: 'DATABASE_URL', value: '', isSecret: true, description: 'PostgreSQL database connection string' },
      { key: 'FIREBASE_PROJECT_ID', value: '', isSecret: false, description: 'Firebase project ID' },
      { key: 'FIREBASE_CLIENT_EMAIL', value: '', isSecret: false, description: 'Firebase service account email' },
      { key: 'FIREBASE_PRIVATE_KEY', value: '', isSecret: true, description: 'Firebase private key' },
      { key: 'RESEND_API_KEY', value: '', isSecret: true, description: 'Resend email API key' },
      { key: 'OPENAI_API_KEY', value: '', isSecret: true, description: 'OpenAI API key for embeddings' },
      { key: 'OPENROUTER_API_KEY', value: '', isSecret: true, description: 'OpenRouter API key for AI chat' },
    ],
    email: {
      provider: 'resend',
      apiKey: '',
      fromEmail: 'contact@taxcode.com.ng',
      fromName: 'TaxCode',
    },
    ai: {
      openaiApiKey: '',
      openrouterApiKey: '',
      defaultModel: 'claude-3.5-sonnet',
      temperature: 0.7,
    },
    database: {
      url: '',
      backupEnabled: true,
      backupFrequency: 'daily',
      lastBackup: undefined,
    },
    firebase: {
      projectId: '',
      clientEmail: '',
      privateKey: '',
    },
    system: {
      maintenanceMode: false,
      allowRegistrations: true,
      maxUploadSize: 10485760, // 10MB
      sessionTimeout: 3600, // 1 hour
    },
  });

  const saveSettings = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'All settings have been saved successfully.',
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSecretVisibility = (key: string) => {
    const newSet = new Set(visibleSecrets);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setVisibleSecrets(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Value copied to clipboard',
    });
  };

  const addEnvVar = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      envVars: [...settings.envVars, { key: '', value: '', isSecret: false }],
    });
  };

  const removeEnvVar = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      envVars: settings.envVars.filter((_, i) => i !== index),
    });
  };

  const updateEnvVar = (index: number, field: 'key' | 'value' | 'isSecret' | 'description', value: string | boolean) => {
    if (!settings) return;
    const updated = [...settings.envVars];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, envVars: updated });
  };

  const createBackup = async () => {
    try {
      const response = await fetch('/api/admin/backup', { method: 'POST' });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Backup created',
          description: 'Database backup has been downloaded.',
        });
        setBackupDialogOpen(false);
        loadSettings();
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create backup',
        variant: 'destructive',
      });
    }
  };

  const restoreBackup = async (file: File) => {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backup),
      });

      if (response.ok) {
        toast({
          title: 'Backup restored',
          description: 'Database has been restored from backup.',
        });
        setRestoreDialogOpen(false);
        loadSettings();
      } else {
        throw new Error('Failed to restore backup');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to restore backup',
        variant: 'destructive',
      });
    }
  };

  const syncFromVercel = async () => {
    setIsSyncingVercel(true);
    try {
      const response = await fetch('/api/admin/vercel-env');
      const data = await response.json();
      
      if (response.ok) {
        if (data.envVars && data.envVars.length > 0) {
          // Merge Vercel env vars with existing ones
          const existingKeys = new Set(settings?.envVars.map(v => v.key) || []);
          const newVars = data.envVars.filter((v: EnvVar) => !existingKeys.has(v.key));
          
          if (settings) {
            setSettings({
              ...settings,
              envVars: [...settings.envVars, ...newVars],
            });
          }
          
          toast({
            title: 'Synced from Vercel',
            description: `Found ${data.envVars.length} environment variables`,
          });
        } else {
          toast({
            title: 'No variables found',
            description: 'No environment variables found in Vercel',
          });
        }
      } else {
        // Handle specific error cases
        if (response.status === 400 && data.error?.includes('VERCEL_TOKEN')) {
          toast({
            title: 'Vercel Token Not Configured',
            description: 'To enable Vercel sync, add VERCEL_TOKEN and VERCEL_PROJECT_ID to your environment variables. This is optional - your variables are already synced from process.env automatically.',
            variant: 'default',
            duration: 8000,
          });
        } else if (response.status === 400 && data.error?.includes('Project ID')) {
          toast({
            title: 'Project ID Required',
            description: 'Add VERCEL_PROJECT_ID to your environment variables or provide it as a query parameter.',
            variant: 'default',
            duration: 8000,
          });
        } else {
          throw new Error(data.error || 'Failed to sync from Vercel');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Sync failed',
        description: error.message || 'Failed to sync environment variables from Vercel',
        variant: 'destructive',
      });
    } finally {
      setIsSyncingVercel(false);
    }
  };

  const testConnection = async (type: 'database' | 'email' | 'firebase' | 'ai') => {
    try {
      const response = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'Connection successful',
          description: result.message || `${type} connection is working`,
        });
      } else {
        throw new Error(result.error || 'Connection failed');
      }
    } catch (error: any) {
      toast({
        title: 'Connection failed',
        description: error.message || `Failed to connect to ${type}`,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-12">Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="env">
            <Key className="w-4 h-4 mr-2" />
            Environment
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="w-4 h-4 mr-2" />
            AI
          </TabsTrigger>
          <TabsTrigger value="firebase">
            <Shield className="w-4 h-4 mr-2" />
            Firebase
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Environment Variables Tab */}
        <TabsContent value="env" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Credential Priority:</strong> The application uses credentials in this order:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li><strong>process.env</strong> (from Vercel/deployment environment) - Highest priority</li>
                <li><strong>Firestore Settings</strong> (saved here) - Fallback for non-critical settings</li>
              </ol>
              <p className="mt-2 text-sm">
                Variables marked with <Badge variant="outline" className="mx-1">env</Badge> are from your deployment environment.
                Variables marked with <Badge variant="outline" className="mx-1">custom</Badge> are documentation/reference only.
              </p>
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>
                    Manage all environment variables. Values from process.env take priority over saved settings.
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={syncFromVercel}
                      disabled={isSyncingVercel}
                      title="Optional: Sync environment variables from Vercel API. Requires VERCEL_TOKEN and VERCEL_PROJECT_ID."
                    >
                      {isSyncingVercel ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <Server className="w-4 h-4 mr-2" />
                          Sync from Vercel
                        </>
                      )}
                    </Button>
                  </div>
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Optional Feature:</strong> Vercel sync requires <code className="bg-muted px-1 rounded">VERCEL_TOKEN</code> and <code className="bg-muted px-1 rounded">VERCEL_PROJECT_ID</code> environment variables. 
                      Your environment variables are already automatically synced from <code className="bg-muted px-1 rounded">process.env</code> - this button is only needed to verify what's configured in Vercel dashboard.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.envVars.map((envVar, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg">
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <Label>Key</Label>
                      {envVar.source && (
                        <Badge variant={envVar.source === 'env' ? 'default' : 'outline'} className="text-xs">
                          {envVar.source}
                        </Badge>
                      )}
                    </div>
                    <Input
                      value={envVar.key}
                      onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                      placeholder="ENV_VAR_NAME"
                      disabled={envVar.source === 'env'} // Can't edit env vars from process.env
                    />
                  </div>
                  <div className="col-span-6">
                    <Label>Value</Label>
                    <div className="flex gap-2">
                      <Input
                        type={visibleSecrets.has(envVar.key) || !envVar.isSecret ? 'text' : 'password'}
                        value={envVar.value}
                        onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                        placeholder="Value"
                      />
                      {envVar.isSecret && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleSecretVisibility(envVar.key)}
                        >
                          {visibleSecrets.has(envVar.key) ? <EyeOff /> : <Eye />}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(envVar.value)}
                      >
                        <Copy />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Secret</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        checked={envVar.isSecret}
                        onCheckedChange={(checked) => updateEnvVar(index, 'isSecret', checked)}
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEnvVar(index)}
                      className="mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {envVar.description && (
                    <div className="col-span-12">
                      <p className="text-sm text-muted-foreground">{envVar.description}</p>
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={addEnvVar} variant="outline">
                Add Environment Variable
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>
                Manage database connection and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Database URL</Label>
                <div className="flex gap-2">
                  <Input
                    type={visibleSecrets.has('DATABASE_URL') ? 'text' : 'password'}
                    value={settings.database.url}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        database: { ...settings.database, url: e.target.value },
                      })
                    }
                    placeholder="postgresql://user:password@host:port/database"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSecretVisibility('DATABASE_URL')}
                  >
                    {visibleSecrets.has('DATABASE_URL') ? <EyeOff /> : <Eye />}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testConnection('database')}
                  >
                    Test Connection
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Backup Settings</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.database.backupEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        database: { ...settings.database, backupEnabled: checked },
                      })
                    }
                  />
                  <span>Enable automatic backups</span>
                </div>
              </div>

              {settings.database.backupEnabled && (
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={settings.database.backupFrequency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        database: { ...settings.database, backupFrequency: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {settings.database.lastBackup && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Last backup: {new Date(settings.database.lastBackup).toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Create Backup
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Database Backup</DialogTitle>
                      <DialogDescription>
                        This will create a complete backup of your database. The backup file will be downloaded automatically.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBackupDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createBackup}>Create Backup</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore Backup
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Restore Database Backup</DialogTitle>
                      <DialogDescription>
                        Select a backup file to restore. This will overwrite your current database.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) restoreBackup(file);
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email service provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Provider</Label>
                <Select
                  value={settings.email.provider}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, provider: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="ses">AWS SES</SelectItem>
                    <SelectItem value="smtp">SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={visibleSecrets.has('EMAIL_API_KEY') ? 'text' : 'password'}
                    value={settings.email.apiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email: { ...settings.email, apiKey: e.target.value },
                      })
                    }
                    placeholder="API Key"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSecretVisibility('EMAIL_API_KEY')}
                  >
                    {visibleSecrets.has('EMAIL_API_KEY') ? <EyeOff /> : <Eye />}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testConnection('email')}
                  >
                    Test Connection
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input
                    value={settings.email.fromEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email: { ...settings.email, fromEmail: e.target.value },
                      })
                    }
                    placeholder="contact@taxcode.com.ng"
                  />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input
                    value={settings.email.fromName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email: { ...settings.email, fromName: e.target.value },
                      })
                    }
                    placeholder="TaxCode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI service providers and models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={visibleSecrets.has('OPENAI_API_KEY') ? 'text' : 'password'}
                    value={settings.ai.openaiApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ai: { ...settings.ai, openaiApiKey: e.target.value },
                      })
                    }
                    placeholder="sk-..."
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSecretVisibility('OPENAI_API_KEY')}
                  >
                    {visibleSecrets.has('OPENAI_API_KEY') ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for embeddings and knowledge base search
                </p>
              </div>

              <div className="space-y-2">
                <Label>OpenRouter API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={visibleSecrets.has('OPENROUTER_API_KEY') ? 'text' : 'password'}
                    value={settings.ai.openrouterApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ai: { ...settings.ai, openrouterApiKey: e.target.value },
                      })
                    }
                    placeholder="sk-or-..."
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSecretVisibility('OPENROUTER_API_KEY')}
                  >
                    {visibleSecrets.has('OPENROUTER_API_KEY') ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for AI chat assistant
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>Default Model</Label>
                <div className="flex gap-2">
                  <Select
                    value={settings.ai.defaultModel && !['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gemini-pro', 'gemini-ultra', 'llama-3-70b', 'llama-3-8b', 'mixtral-8x7b'].includes(settings.ai.defaultModel) ? 'custom' : settings.ai.defaultModel}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setSettings({
                          ...settings,
                          ai: { ...settings.ai, defaultModel: customModelInput || 'custom' },
                        });
                      } else {
                        setSettings({
                          ...settings,
                          ai: { ...settings.ai, defaultModel: value },
                        });
                        setCustomModelInput('');
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet (Anthropic)</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus (Anthropic)</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku (Anthropic)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro (Google)</SelectItem>
                      <SelectItem value="gemini-ultra">Gemini Ultra (Google)</SelectItem>
                      <SelectItem value="llama-3-70b">Llama 3 70B (Meta)</SelectItem>
                      <SelectItem value="llama-3-8b">Llama 3 8B (Meta)</SelectItem>
                      <SelectItem value="mixtral-8x7b">Mixtral 8x7B (Mistral)</SelectItem>
                      <SelectItem value="custom">Custom Model...</SelectItem>
                    </SelectContent>
                  </Select>
                  {(settings.ai.defaultModel === 'custom' || (settings.ai.defaultModel && !['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gemini-pro', 'gemini-ultra', 'llama-3-70b', 'llama-3-8b', 'mixtral-8x7b'].includes(settings.ai.defaultModel))) && (
                    <Input
                      placeholder="Enter custom model name"
                      value={customModelInput || settings.ai.defaultModel}
                      onChange={(e) => {
                        setCustomModelInput(e.target.value);
                        setSettings({
                          ...settings,
                          ai: { ...settings.ai, defaultModel: e.target.value },
                        });
                      }}
                      className="flex-1"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Select from popular models or enter a custom model name. Model must be available on your AI provider.
                </p>
              </div>
                <div className="space-y-2">
                  <Label>Temperature: {settings.ai.temperature}</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.ai.temperature}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ai: { ...settings.ai, temperature: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => testConnection('ai')}
              >
                Test AI Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Firebase Tab */}
        <TabsContent value="firebase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Firebase Configuration</CardTitle>
              <CardDescription>
                Manage Firebase authentication and Firestore settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project ID</Label>
                <Input
                  value={settings.firebase.projectId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      firebase: { ...settings.firebase, projectId: e.target.value },
                    })
                  }
                  placeholder="your-project-id"
                />
              </div>

              <div className="space-y-2">
                <Label>Client Email</Label>
                <Input
                  value={settings.firebase.clientEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      firebase: { ...settings.firebase, clientEmail: e.target.value },
                    })
                  }
                  placeholder="firebase-adminsdk@project.iam.gserviceaccount.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Private Key</Label>
                <div className="flex gap-2">
                  <Textarea
                    rows={4}
                    type={visibleSecrets.has('FIREBASE_PRIVATE_KEY') ? 'text' : 'password'}
                    value={settings.firebase.privateKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        firebase: { ...settings.firebase, privateKey: e.target.value },
                      })
                    }
                    placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSecretVisibility('FIREBASE_PRIVATE_KEY')}
                  >
                    {visibleSecrets.has('FIREBASE_PRIVATE_KEY') ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => testConnection('firebase')}
              >
                Test Firebase Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure general system behavior and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to show maintenance page to all users except admins
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, maintenanceMode: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable new user registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.allowRegistrations}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, allowRegistrations: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Upload Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.system.maxUploadSize / 1048576}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        system: {
                          ...settings.system,
                          maxUploadSize: parseInt(e.target.value) * 1048576,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.system.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        system: {
                          ...settings.system,
                          sessionTimeout: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={loadSettings}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}



