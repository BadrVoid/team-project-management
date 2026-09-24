import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Loader2,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  useMyProfile,
  useUpdateMyProfile,
  useUploadAvatar,
} from "@/hooks/useProfile";

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const updateProfile = useUpdateMyProfile();
  const uploadAvatar = useUploadAvatar();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [bio, setBio] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    setBio(profile.bio ?? "");
    setUniversity(profile.university ?? "");
    setDepartment(profile.department ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
    setSkills(profile.skills ?? []);
    setTags(profile.tags ?? []);
  }, [profile]);

  // Clean up blob preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let finalAvatarUrl = avatarUrl.trim();

    // If a new file was selected, upload it first
    if (selectedFile) {
      try {
        const uploadedUrl = await uploadAvatar.mutateAsync(selectedFile);
        finalAvatarUrl = uploadedUrl;
        setAvatarUrl(uploadedUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error("Failed to upload avatar image:", error);
        return;
      }
    }

    updateProfile.mutate({
      bio: bio.trim(),
      university: university.trim(),
      department: department.trim(),
      avatarUrl: finalAvatarUrl,
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

  const currentAvatar = previewUrl || avatarUrl || profile.avatarUrl;
  const isSaving = updateProfile.isPending || uploadAvatar.isPending;

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
          disabled={isSaving}
          className="w-full gap-2 sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {uploadAvatar.isPending ? "Uploading image..." : "Saving..."}
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
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Interactive Avatar Container */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex size-28 cursor-pointer shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm transition-all hover:border-primary/50"
              >
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {initials || <UserRound className="size-10" />}
                  </span>
                )}

                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="size-6" />
                  <span className="mt-1 text-[10px] font-medium">
                    Upload Photo
                  </span>
                </div>
              </div>

              {/* Avatar Quick Action Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Camera className="size-3.5" />
                  Change Photo
                </Button>

                {currentAvatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
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
                          className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
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
                          className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
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
