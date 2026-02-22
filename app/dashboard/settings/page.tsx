'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, DollarSign, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SalaryPreset } from '@/lib/types';
import { formatCost } from '@/lib/calculations';
import { getPresets, savePresets, getDefaultSalary, saveDefaultSalary } from '@/lib/storage';

const DEFAULT_PRESETS: Omit<SalaryPreset, 'id' | 'user_id' | 'created_at'>[] = [
    { role_name: 'Software Engineer', annual_salary: 130000 },
    { role_name: 'Senior Engineer', annual_salary: 180000 },
    { role_name: 'Engineering Manager', annual_salary: 200000 },
    { role_name: 'Product Manager', annual_salary: 150000 },
    { role_name: 'Designer', annual_salary: 120000 },
    { role_name: 'Data Scientist', annual_salary: 160000 },
];

export default function SettingsPage() {
    const [presets, setPresets] = useState<SalaryPreset[]>([]);
    const [newRole, setNewRole] = useState('');
    const [newSalary, setNewSalary] = useState<number>(100000);
    const [defaultSalary, setDefaultSalary] = useState<number>(120000);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const load = async () => {
            const savedPresets = await getPresets();
            if (savedPresets.length > 0) {
                setPresets(savedPresets);
            } else {
                loadDefaults();
            }
            const defSalary = await getDefaultSalary();
            setDefaultSalary(defSalary);
        };
        load();
    }, []);

    const loadDefaults = () => {
        const defaults: SalaryPreset[] = DEFAULT_PRESETS.map((p) => ({
            ...p,
            id: crypto.randomUUID(),
            user_id: 'local',
            created_at: new Date().toISOString(),
        }));
        setPresets(defaults);
    };

    const addPreset = () => {
        if (!newRole.trim() || newSalary <= 0) return;
        const preset: SalaryPreset = {
            id: crypto.randomUUID(),
            user_id: 'local',
            role_name: newRole.trim(),
            annual_salary: newSalary,
            created_at: new Date().toISOString(),
        };
        setPresets([...presets, preset]);
        setNewRole('');
        setNewSalary(100000);
    };

    const deletePreset = (id: string) => {
        setPresets(presets.filter((p) => p.id !== id));
    };

    const saveAll = async () => {
        await savePresets(presets);
        await saveDefaultSalary(defaultSalary);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Settings</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage salary presets and default values.
                    </p>
                </div>
                <Button
                    onClick={saveAll}
                    className={`gap-2 ${saved
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-emerald-600 hover:bg-emerald-500'
                        } text-white`}
                >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save All'}
                </Button>
            </div>

            {/* Default Salary */}
            <Card className="border-border/20 bg-card/30">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Default Annual Salary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                        Used when no specific role is selected. This is the fallback for cost calculations.
                    </p>
                    <div className="flex gap-3 items-end">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Annual Salary ($)</Label>
                            <Input
                                type="number"
                                min={1000}
                                step={1000}
                                value={defaultSalary}
                                onChange={(e) => setDefaultSalary(Number(e.target.value))}
                                className="w-48 bg-background/50"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground pb-2">
                            = {formatCost(defaultSalary / 2080)}/hour
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Salary Presets */}
            <Card className="border-border/20 bg-card/30">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        Role Salary Presets
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Define salaries for common roles in your organization for more accurate cost
                        tracking.
                    </p>

                    {/* Existing presets */}
                    <div className="space-y-2">
                        {presets.map((preset, i) => (
                            <motion.div
                                key={preset.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="flex items-center justify-between rounded-lg border border-border/20 bg-background/30 px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium text-sm">{preset.role_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatCost(preset.annual_salary)}/year •{' '}
                                        {formatCost(preset.annual_salary / 2080)}/hour
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deletePreset(preset.id)}
                                    className="text-muted-foreground hover:text-red-400"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Add new preset */}
                    <div className="flex gap-3 items-end pt-2 border-t border-border/20">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">Role Name</Label>
                            <Input
                                type="text"
                                placeholder="e.g. Staff Engineer"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="w-36 space-y-1">
                            <Label className="text-xs text-muted-foreground">Annual Salary ($)</Label>
                            <Input
                                type="number"
                                min={1000}
                                step={1000}
                                value={newSalary}
                                onChange={(e) => setNewSalary(Number(e.target.value))}
                                className="bg-background/50"
                            />
                        </div>
                        <Button onClick={addPreset} variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" /> Add
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
