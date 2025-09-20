import React from "react";
import prisma from "@/src/lib/prisma";
import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MaterialLinkWrapper } from "@/app/components/MaterialLinkWrapper";

const Page = async () => {
  const mats = await prisma.material.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pilih Passionmu</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mats.length > 0 ? (
            mats.map((item, index) => (
              <MaterialLinkWrapper item={item} key={index}>
                <Card className="bg-background transition-colors duration-300 flex pt-0 flex-col h-full">
                  <Image
                    src={item.imageUrl}
                    width={120}
                    height={120}
                    alt={item.name}
                    className="h-48 object-cover w-full rounded-t-lg flex items-center justify-center"
                  />
                  <CardContent className="flex-grow">
                    <div className="flex items-center gap-3">
                      <Layers className="size-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-primary leading-tight">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MaterialLinkWrapper>
            ))
          ) : (
            <div className="col-span-4">
              <p>
                Lha kok? Kosong ya? Coba nanti kamu cek lagi yah, hehe maaf.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
