import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Shield,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/context/AuthContext";
import { useChangePassword } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useProfile";

export default function SettingsPage() {
  const { logout } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const changePasswordMutation = useChangePassword();

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Separate password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSuccess("Password changed successfully.");

          setTimeout(() => {
            setIsPasswordOpen(false);
            setPasswordSuccess("");
          }, 2000);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          setPasswordError(
            error?.response?.data?.message || "Failed to change password. Please check your credentials."
          );
        },
      }
    );
  };

  if (isProfileLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and security settings.
          </p>
        </div>

        <Card>
          <CardHeader className="gap-2">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-24 animate-pulse rounded bg-muted/60" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and security settings.
          </p>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="size-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive font-medium">
              Failed to load your account information. Please refresh the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLocalAccount = !profile.authProvider;
  const providerName =
    profile.authProvider === "GOOGLE"
      ? "Google"
      : profile.authProvider === "GITHUB"
      ? "GitHub"
      : profile.authProvider;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account defaults, authentication, and active session.
        </p>
      </div>

      {/* Account Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5 text-muted-foreground" />
            <CardTitle className="text-lg">Account Details</CardTitle>
          </div>
          <CardDescription>
            Basic information associated with your account identity.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">First Name</Label>
              <Input value={profile.firstName} disabled className="bg-muted/40" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <Input value={profile.lastName} disabled className="bg-muted/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email Address</Label>
            <Input value={profile.email} disabled className="bg-muted/40" />
          </div>

          <p className="text-xs text-muted-foreground">
            To update your bio or university details, visit your Profile page.
          </p>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-muted-foreground" />
            <CardTitle className="text-lg">Security & Authentication</CardTitle>
          </div>
          <CardDescription>
            Manage password updates and authentication credentials.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {isLocalAccount ? (
            <div className="space-y-4">
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setIsPasswordOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Lock className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Change Password</p>
                    <p className="text-xs text-muted-foreground">
                      Ensure your account uses a strong password.
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  tabIndex={-1}
                  className="text-xs font-medium"
                >
                  {isPasswordOpen ? "Cancel" : "Update"}
                </Button>
              </button>

              {/* Password Form Collapsible */}
              {isPasswordOpen && (
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-4 rounded-lg border bg-muted/30 p-4 sm:p-5"
                >
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Minimum length of 8 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Alert Messages */}
                  {passwordError && (
                    <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2.5 rounded-md">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-500/10 p-2.5 rounded-md dark:text-emerald-400">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      size="sm"
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 size-3.5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Save Password"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* OAuth Provider Account */
            <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
              <Lock className="mt-0.5 size-5 text-muted-foreground shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Single Sign-On Managed</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your account was created with{" "}
                  <span className="font-semibold text-foreground">
                    {providerName}
                  </span>
                  . Passwords and security credentials are managed directly through your third-party provider.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions / Logout */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Sign Out</p>
            <p className="text-xs text-muted-foreground">
              Sign out of your active session on this device.
            </p>
          </div>

          <Button variant="destructive" onClick={logout} size="sm">
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}