import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { RootState } from '@/store';
import { Usage } from './Usage';
import { Pricing } from './Pricing';
import { useState, useEffect } from 'react';
import { userApi, User } from '@/services/api';
import { useTeam } from '@/hooks/useTeam';
import { Organization } from '@/types/organization';

export function Settings() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isOrgAdmin = user?.role === 'org_admin' || user?.role === 'executive' || user?.role === 'operations_admin';

  const [orgSettings, setOrgSettings] = useState<Organization | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { getTeamMembers } = useTeam();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, teamRes] = await Promise.all([
          userApi.getOrganizationSettings(),
          getTeamMembers()
        ]);
        setOrgSettings(settingsRes.data);
        if (teamRes.success) {
          setTeamMembers(teamRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings/team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">
            Manage your account, organization, and platform preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-3 sm:space-y-4">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-lg bg-gray-100 p-0.5 sm:p-1 border border-gray-200 overflow-x-auto no-scrollbar w-full">
          <TabsTrigger
            value="profile"
            className="rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 transition-colors whitespace-nowrap"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="organisation"
            className="rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 transition-colors whitespace-nowrap"
          >
            Organisation
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            className="rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 transition-colors whitespace-nowrap"
          >
            Usage & Billing
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 transition-colors whitespace-nowrap"
          >
            Plans
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 transition-colors whitespace-nowrap"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 transition-colors whitespace-nowrap"
          >
            Team
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-3 sm:space-y-4">
          <Card className="bg-white">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base font-semibold text-gray-900">Profile settings</CardTitle>
              <CardDescription className="text-gray-600">
                Core account information used across approvals, audit logs, and ownership records.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:gap-4 md:grid-cols-3 p-4 sm:p-6 pt-0">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="text-gray-700 text-sm">Name</Label>
                <Input
                  id="profile-name"
                  defaultValue={
                    user ? `${user.firstName} ${user.lastName}` : 'Jane Compliance'
                  }
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="text-gray-700 text-sm">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={user?.email ?? 'jane.compliance@blazetech.demo'}
                  readOnly
                  className="bg-gray-50 border-gray-300 cursor-not-allowed text-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-role" className="text-gray-700 text-sm">Role</Label>
                <Input
                  id="profile-role"
                  value={user?.role ?? 'Compliance Officer'}
                  readOnly
                  className="bg-gray-50 border-gray-300 cursor-not-allowed text-gray-900"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organisation settings */}
        <TabsContent value="organisation" className="space-y-3 sm:space-y-4">
          <Card className="bg-white">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base font-semibold text-gray-900">Organisation settings</CardTitle>
              <CardDescription className="text-gray-600">
                Configure how BlazeTech represents your institution across dashboards and reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:gap-4 md:grid-cols-2 p-4 sm:p-6 pt-0">
              <div className="space-y-1.5">
                <Label htmlFor="org-name" className="text-gray-700 text-sm">Organisation name</Label>
                <Input
                  id="org-name"
                  placeholder="Fintrak Microfinance Bank"
                  defaultValue={user?.organizationName}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-industry" className="text-gray-700 text-sm">Industry</Label>
                <Select>
                  <SelectTrigger id="org-industry" className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select industry" className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="banking" className="text-gray-900">Banking</SelectItem>
                    <SelectItem value="lending" className="text-gray-900">Digital lending</SelectItem>
                    <SelectItem value="payments" className="text-gray-900">Payments</SelectItem>
                    <SelectItem value="fintech" className="text-gray-900">Fintech platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-region" className="text-gray-700 text-sm">Regulatory region</Label>
                <Select>
                  <SelectTrigger id="org-region" className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select region" className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="cbn" className="text-gray-900">CBN (Nigeria)</SelectItem>
                    <SelectItem value="boe" className="text-gray-900">Bank of England (UK)</SelectItem>
                    <SelectItem value="ecb" className="text-gray-900">ECB (EU)</SelectItem>
                    <SelectItem value="other" className="text-gray-900">Other / multi-regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-timezone" className="text-gray-700 text-sm">Reporting timezone</Label>
                <Select>
                  <SelectTrigger id="org-timezone" className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select timezone" className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="africa-lagos" className="text-gray-900">Africa / Lagos</SelectItem>
                    <SelectItem value="utc" className="text-gray-900">UTC</SelectItem>
                    <SelectItem value="europe-london" className="text-gray-900">Europe / London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage & Billing */}
        <TabsContent value="usage" className="space-y-3 sm:space-y-4">
          <Usage />
        </TabsContent>

        {/* Pricing & Plans */}
        <TabsContent value="pricing" className="space-y-3 sm:space-y-4">
          <Pricing />
        </TabsContent>

        {/* Security & Access */}
        <TabsContent value="security" className="space-y-3 sm:space-y-4">
          <Card className="bg-white">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base font-semibold text-gray-900">Security & access</CardTitle>
              <CardDescription className="text-gray-600">
                High-level controls for authentication, sessions, and access boundaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Password</Label>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Change password
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Current session</Label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    <div>Browser: Chrome · macOS</div>
                    <div>IP: 10.0.0.24</div>
                    <div>Last activity: a few minutes ago</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Multi-factor authentication
                  </p>
                  <p className="text-xs text-gray-600">
                    2FA is enforced by your administrator. Status: Enabled.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-100 self-start sm:self-auto">
                  Enabled
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Restrict access by IP allowlist
                  </p>
                  <p className="text-xs text-gray-600">
                    Only allow logins from networks defined in the IP allowlist.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Block legacy TLS versions
                  </p>
                  <p className="text-xs text-gray-600">
                    Require modern TLS ciphers for all API and UI traffic.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team & Roles */}
        <TabsContent value="team" className="space-y-3 sm:space-y-4">
          <Card className="bg-white">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base font-semibold text-gray-900">Team & roles</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your organization's team members and their access levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">Role model</p>
                  <p className="text-xs text-gray-600">
                    BlazeTech uses role-based access control to ensure data security.
                  </p>
                </div>
                {isOrgAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 self-start sm:self-auto"
                  >
                    Invite team member
                  </Button>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="text-gray-900 text-xs sm:text-sm py-3 px-3 sm:px-4">Name</TableHead>
                        <TableHead className="text-gray-900 text-xs sm:text-sm py-3 px-3 sm:px-4 hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-gray-900 text-xs sm:text-sm py-3 px-3 sm:px-4">Role</TableHead>
                        <TableHead className="text-gray-900 text-xs sm:text-sm py-3 px-3 sm:px-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id} className="border-gray-200 hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900 text-xs sm:text-sm py-3 px-3 sm:px-4">
                            <div>
                              <div>{member.firstName} {member.lastName}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{member.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 py-3 px-3 sm:px-4 hidden sm:table-cell">{member.email}</TableCell>
                          <TableCell className="text-xs text-gray-600 font-mono py-3 px-3 sm:px-4">{member.role}</TableCell>
                          <TableCell className="py-3 px-3 sm:px-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${member.active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-600'}`}>
                              {member.active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {teamMembers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500 text-sm">
                            {loading ? 'Loading team members...' : 'No team members found.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0">
        <Button 
          variant="outline" 
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 sm:mr-2 order-2 sm:order-1"
        >
          Discard changes
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2">
          Save configuration
        </Button>
      </div>
    </div>
  );
}