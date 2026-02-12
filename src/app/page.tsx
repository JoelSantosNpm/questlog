import prisma from "@/lib/prisma";
import { createCampaign } from "@/actions/campaign-actions";

export default async function Home() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <h1 className="text-4xl font-bold mb-8">QuestLog Campaigns</h1>

      <div className="w-full max-w-md mb-12">
        <h2 className="text-2xl font-semibold mb-4">Create New Campaign</h2>
        <form action={createCampaign} className="flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="Campaign Name"
            required
            className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Create
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Existing Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No campaigns found.
          </p>
        ) : (
          <ul className="space-y-4">
            {campaigns.map(
              (campaign: {
                id: number;
                name: string;
                active: boolean;
                createdAt: Date;
              }) => (
                <li
                  key={campaign.id}
                  className="p-4 border rounded-lg bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{campaign.name}</h3>
                    <p className="text-sm text-zinc-500">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                    {campaign.active ? "Active" : "Inactive"}
                  </span>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
