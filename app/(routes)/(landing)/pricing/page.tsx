"use client";

import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { Bot } from "lucide-react";
import { dark, neobrutalism, shadesOfPurple } from "@clerk/themes";
import { useTheme } from "next-themes";

const Page = () => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col max-w-3xl mx-auto w-full">
            <section className="space-y-6 pt-[8dvh] md:pt-[16dvh]">
                <div className="flex flex-col items-center">
                    <img src="/media/bloom.svg" alt="" />
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
                <p className="text-muted-foreground text-center text-sm md:text-base">
                    Choose the plan that fits your needs
                </p>
                <PricingTable
                    appearance={{
                        baseTheme: theme === "dark" ? dark : undefined,
                        elements: {
                            pricingTableCard: "border! shadow-none! rounded-lg!",
                        },
                    }}
                />
            </section>
        </div>
    );
};

export default Page;