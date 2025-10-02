import { UserProfile, SignedIn, useUser, useAuth } from "@clerk/clerk-react";

export default function Profile() {
  const { user } = useUser();
  const { getToken } = useAuth();

  return (
    <>
      <SignedIn>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-2xl flex flex-col overflow-hidden p-8">
            <h2 className="text-5xl font-bold text-center my-20">
              Dein Account
            </h2>

            <div className="space-y-4 w-full">
              <div className="grid grid-cols-[150px_1fr] gap-4 p-4">
                <p className="text-sm text-gray-500">Vorname</p>
                <p className="font-medium text-left border rounded-md p-2 bg-white">
                  {user.firstName}
                </p>
              </div>

              <div className="grid grid-cols-[150px_1fr] gap-4 p-4">
                <p className="text-sm text-gray-500">Nachname</p>
                <p className="font-medium text-left border rounded-md p-2 bg-white">
                  {user.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <UserProfile />
      </SignedIn>
    </>
  );
}
