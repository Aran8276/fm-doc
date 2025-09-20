import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import DeleteUserButton from "@/app/components/DeleteUserButton";
import EditUserButton from "@/app/components/EditUserButton";

export default async function ManageUserPage() {
  const session = await getServerSession(authOptions);
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredUsers = users.filter((user) => user.id !== session?.user?.id);

  return (
    <section className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Kelola User</h1>
      <ul className="mt-6 space-y-4">
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-md shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Role:{" "}
                  <span className="font-medium text-primary">{user.role}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Gabung pada:{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(user.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EditUserButton user={user} />
                <DeleteUserButton id={user.id} />
              </div>
            </li>
          ))
        ) : (
          <p className="w-full text-center mt-8">No other users found.</p>
        )}
      </ul>
    </section>
  );
}
