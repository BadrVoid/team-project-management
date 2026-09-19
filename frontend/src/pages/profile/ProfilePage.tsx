import { useEffect, useState } from "react";
import { Loader2, Save, UserRound, X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useMyProfile, useUpdateMyProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const [bio, setBio] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!profile) return;

    setBio(profile.bio ?? "");
    setUniversity(profile.university ?? "");
    setDepartment(profile.department ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
    setSkills(profile.skills ?? []);
    setTags(profile.tags ?? []);
  }, [profile]);

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || skills.includes(value)) return;
    setSkills((current) => [...current, value]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((current) => current.filter((item) => item !== skill));
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags((current) => [...current, value]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((current) => current.filter((item) => item !== tag));
  };

  const handleSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateProfile.mutate({
      bio: bio.trim(),
      university: university.trim(),
      department: department.trim(),
      avatarUrl: avatarUrl.trim(),
      skills,
      tags,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Failed to load your profile.
        </p>
      </div>
    );
  }

  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

  const currentAvatar = avatarUrl || profile.avatarUrl;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your public identity, background, and skills.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={updateProfile.isPending}
          className="w-full gap-2 sm:w-auto"
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Public Identity Card (Sticky on Desktop) */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
          <Card>
            <CardContent className="flex flex-col items-center pt-6 text-center">
              <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {initials || <UserRound className="size-10" />}
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-lg font-semibold leading-tight">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <Badge variant="secondary" className="capitalize">
                  {profile.role}
                </Badge>
                {profile.authProvider && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {profile.authProvider}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Editable Profile Sections */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-8">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>
                Account information managed by your provider and institution
                details.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  First Name
                </Label>
                <Input
                  value={profile.firstName}
                  disabled
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Last Name
                </Label>
                <Input
                  value={profile.lastName}
                  disabled
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Email Address
                </Label>
                <Input value={profile.email} disabled className="bg-muted/50" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. Stanford University"
                  maxLength={255}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  maxLength={255}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>

          {/* About & Bio */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">About</CardTitle>
              <CardDescription>
                A short biography displayed on your public profile.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief introduction about yourself, your background, or projects..."
                className="min-h-28 resize-none"
                maxLength={500}
              />
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {bio.length}/500
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Focus Areas */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Skills & Tags</CardTitle>
              <CardDescription>
                Highlight technical competencies and domain interests.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Skills */}
              <div className="space-y-2.5">
                <Label htmlFor="skill-input">Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skill-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="e.g. React, TypeScript, Spring Boot"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    className="gap-1"
                  >
                    <Plus className="size-4" /> Add
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 pr-1.5 text-xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                        >
                          <X className="size-3 text-muted-foreground" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2.5">
                <Label htmlFor="tag-input">Interest Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tag-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. Artificial Intelligence, Open Source"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="gap-1"
                  >
                    <Plus className="size-4" /> Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="gap-1 pr-1.5 text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                        >
                          <X className="size-3 text-muted-foreground" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
