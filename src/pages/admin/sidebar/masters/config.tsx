"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const defaultConfig = {
  validity: new Date(2025, 0, 1) as Date,
  accessType: ["Mobile", "Web"],
  maxUsers: 5,
  availablePlatforms: ["Android", "iOS", "Browser"],
  supportTicketLimit: "50",
  customCategories: true,
  customPriorities: true,
  slaEnabled: true,
  agentReassignment: false,
  feedback: true,
  trustScore: true,
  analytics: "Basic",
  aiSuggestions: "Limited",
  knowledgeBase: "Org. Specific KB (upto 100 MB)",
  customBranding: false,
  multiDepartment: "3",
  supportChannels: ["App", "Email"],
  adminDashboard: "Limited",
  dataExport: true,
  roleBasedAccess: false,
  masterDataUpload: "One-time Upload",
  announcements: "Create/Edit",
  supportSLA: "Standard (Email within 72 hrs)",
}

const options = {
  accessType: ["Mobile", "Web"],
  platforms: ["Android", "iOS", "Browser"],
  supportTicket: ["50", "200", "Unlimited"],
  analytics: ["Basic", "Full-Access"],
  aiSuggestions: ["Limited", "Standard"],
  knowledgeBase: ["Org. Specific KB (upto 100 MB)", "Advanced KB (Free Upto 500 MB)"],
  multiDepartment: ["3", "More than 3"],
  adminDashboard: ["Limited", "Standard"],
  masterDataUpload: ["One-time Upload", "Any-time Scheduled Upload"],
  announcements: ["Create/Edit", "Create/Edit/Delete"],
  supportSLA: ["Standard (Email within 72 hrs)", "Priority (Email within 24 hrs)", "Priority (within 6 hrs)"],
  supportChannels: ["App", "Email"],
}

export default function SimplifiedPermissions() {
  const [config, setConfig] = useState({ ...defaultConfig })
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)

  type ConfigKey = keyof typeof defaultConfig
  type ConfigValue = (typeof defaultConfig)[ConfigKey]

  const handleChange = (key: ConfigKey, value: ConfigValue) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckboxChange = (key: ConfigKey, value: string) => {
    setConfig((prev) => {
      const arr = prev[key] as string[]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const handleReset = () => setConfig({ ...defaultConfig })
  const handleSave = () => alert("Configuration saved successfully!")

  const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )

  const ToggleField = ({
    label,
    checked,
    onChange,
  }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )

  const CheckboxGroup = ({
    options,
    selected,
    onChange,
  }: { options: string[]; selected: string[]; onChange: (value: string) => void }) => (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm">
          <Checkbox checked={selected.includes(option)} onCheckedChange={() => onChange(option)} />
          {option}
        </label>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-semibold">Configuration Settings</CardTitle>
        </CardHeader>

        <CardContent className="card-body grid grid-cols-1 lg:grid-cols-2 gap-5 py-5 lg:py-7.5">
          {/* Group 1: Validity & Access */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Validity & Access</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 1. Validity */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Validity</label>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="input data-[state=open]:border-primary text-left"
                      onClick={() => setDatePopoverOpen(true)}
                    >
                      {config.validity ? format(config.validity, 'LLL dd, y') : 'Pick expiry date'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={config.validity}
                      onSelect={(date) => {
                        if (date) {
                          handleChange('validity', date)
                          setDatePopoverOpen(false)
                        }
                      }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* 2. Access Type */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Access Type</label>
                <div className="flex gap-4">
                  {options.accessType.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={config.accessType.includes(opt)}
                        onCheckedChange={(v: boolean) => handleCheckboxChange('accessType', opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Group 2: User & Platform Limits */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>User & Platform Limits</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 3. Max Users */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Max Users</label>
                <Input
                  type="number"
                  value={config.maxUsers}
                  min={1}
                  onChange={(e) => handleChange('maxUsers', Number(e.target.value))}
                />
              </div>
              {/* 4. Available Platforms */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Available Platforms</label>
                <div className="flex gap-4">
                  {options.platforms.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={config.availablePlatforms.includes(opt)}
                        onCheckedChange={(v: boolean) => handleCheckboxChange('availablePlatforms', opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* 5. Support Ticket Limit / Month */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Support Ticket Limit / Month</label>
                <Select
                  disabled={true}
                  value={config.supportTicketLimit}
                  onValueChange={(v: string) => handleChange('supportTicketLimit', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.supportTicket.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Group 3: Customization */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 6. Custom Categories */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Custom Categories</label>
                <Switch
                  checked={config.customCategories}
                  onCheckedChange={(v: boolean) => handleChange('customCategories', v)}
                />
              </div>
              {/* 7. Custom Priorities */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Custom Priorities</label>
                <Switch
                  checked={config.customPriorities}
                  onCheckedChange={(v: boolean) => handleChange('customPriorities', v)}
                />
              </div>
              {/* 15. Custom Branding */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Custom Branding</label>
                <Switch
                  checked={config.customBranding}
                  onCheckedChange={(v: boolean) => handleChange('customBranding', v)}
                />
              </div>
            </CardContent>
          </Card>
          {/* Group 4: Support & SLA */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Support & SLA</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 8. SLA & Escalation Matrix */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">SLA & Escalation Matrix</label>
                <Switch
                  checked={config.slaEnabled}
                  onCheckedChange={(v: boolean) => handleChange('slaEnabled', v)}
                />
              </div>
              {/* 9. Agent Reassignment Options */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Agent Reassignment Options</label>
                <Switch
                  checked={config.agentReassignment}
                  onCheckedChange={(v: boolean) => handleChange('agentReassignment', v)}
                />
              </div>
              {/* 23. Support SLA */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Support SLA</label>
                <Select
                  value={config.supportSLA}
                  onValueChange={(v: string) => handleChange('supportSLA', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.supportSLA.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Group 5: Feedback & Trust */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Feedback & Trust</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 10. Feedback */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Feedback</label>
                <Switch
                  checked={config.feedback}
                  onCheckedChange={(v: boolean) => handleChange('feedback', v)}
                />
              </div>
              {/* 11. Trust Score */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Trust Score</label>
                <Switch
                  checked={config.trustScore}
                  onCheckedChange={(v: boolean) => handleChange('trustScore', v)}
                />
              </div>
            </CardContent>
          </Card>
          {/* Group 6: Analytics & AI */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Analytics & AI</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Analytics & Reports Switch */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900 flex items-center gap-2">
                  Analytics & Reports
                  <Switch
                    checked={!!config.analytics}
                    onCheckedChange={(v: boolean) => {
                      if (!v) {
                        handleChange('analytics', '');
                      } else {
                        handleChange('analytics', options.analytics[0]);
                      }
                    }}
                  />
                </label>
              </div>
              {/* 12. Analytics & Reports Dropdown */}
              <div className="flex flex-col gap-1">
                <Select
                  value={config.analytics}
                  onValueChange={(v: string) => handleChange('analytics', v)}
                  disabled={!config.analytics}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.analytics.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* AI-based Suggestions Switch */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900 flex items-center gap-2">
                  AI-based Suggestions
                  <Switch
                    checked={!!config.aiSuggestions}
                    onCheckedChange={(v: boolean) => {
                      if (!v) {
                        handleChange('aiSuggestions', '');
                      } else {
                        handleChange('aiSuggestions', options.aiSuggestions[0]);
                      }
                    }}
                  />
                </label>
              </div>
              {/* 13. AI-based Suggestions Dropdown */}
              <div className="flex flex-col gap-1">
                <Select
                  value={config.aiSuggestions}
                  onValueChange={(v: string) => handleChange('aiSuggestions', v)}
                  disabled={!config.aiSuggestions}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.aiSuggestions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Group 7: Knowledge Base & Department */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Knowledge Base & Department</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Knowledge Base Switch */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900 flex items-center gap-2">
                  Knowledge Base Access
                  <Switch
                    checked={!!config.knowledgeBase}
                    onCheckedChange={(v: boolean) => {
                      if (!v) {
                        handleChange('knowledgeBase', '');
                      } else {
                        handleChange('knowledgeBase', options.knowledgeBase[0]);
                      }
                    }}
                  />
                </label>
              </div>
              {/* 14. Knowledge Base Access Dropdown */}
              <div className="flex flex-col gap-1">
                <Select
                  value={config.knowledgeBase}
                  onValueChange={(v: string) => handleChange('knowledgeBase', v)}
                  disabled={!config.knowledgeBase}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.knowledgeBase.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Multi-Department Support Switch */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900 flex items-center gap-2">
                  Multi-Department Support
                  <Switch
                    checked={!!config.multiDepartment}
                    onCheckedChange={(v: boolean) => {
                      if (!v) {
                        handleChange('multiDepartment', '');
                      } else {
                        handleChange('multiDepartment', options.multiDepartment[0]);
                      }
                    }}
                  />
                </label>
              </div>
              {/* 16. Multi-Department Support Dropdown */}
              <div className="flex flex-col gap-1">
                <Select
                  value={config.multiDepartment}
                  onValueChange={(v: string) => handleChange('multiDepartment', v)}
                  disabled={!config.multiDepartment}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.multiDepartment.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Group 8: Channels & Admin */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Channels & Admin</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 17. Support Channels */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Support Channels</label>
                <div className="flex gap-4">
                  {options.supportChannels.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={config.supportChannels.includes(opt)}
                        onCheckedChange={(v: boolean) => handleCheckboxChange('supportChannels', opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* 18. Admin Dashboard */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-sm text-gray-900 flex items-center gap-2">
                    Admin Dashboard
                    <Switch
                      checked={!!config.adminDashboard}
                      onCheckedChange={(v: boolean) => {
                        if (!v) {
                          handleChange('adminDashboard', '');
                        } else {
                          handleChange('adminDashboard', options.adminDashboard[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-1">
                  <Select
                    value={config.adminDashboard}
                    onValueChange={(v: string) => handleChange('adminDashboard', v)}
                    disabled={!config.adminDashboard}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options.adminDashboard.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Group 9: Data & Roles */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Data & Roles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* 19. Data Export */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Data Export</label>
                <Switch
                  checked={config.dataExport}
                  onCheckedChange={(v: boolean) => handleChange('dataExport', v)}
                />
              </div>
              {/* 20. Role-Based Access */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Role-Based Access</label>
                <Switch
                  checked={config.roleBasedAccess}
                  onCheckedChange={(v: boolean) => handleChange('roleBasedAccess', v)}
                />
              </div>
              {/* 21. Master Data Upload */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Master Data Upload</label>
                <Select
                  value={config.masterDataUpload}
                  onValueChange={(v: string) => handleChange('masterDataUpload', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.masterDataUpload.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* 22. Announcements */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-gray-900">Announcements</label>
                <Select
                  value={config.announcements}
                  onValueChange={(v: string) => handleChange('announcements', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.announcements.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </CardFooter>

        
      </Card>
    </div>
  )
}
