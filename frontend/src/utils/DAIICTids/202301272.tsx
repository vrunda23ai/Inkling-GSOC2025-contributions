import { sendDAIICTid, CardDetails } from "../../hooks/useSocket.ts";
import { date } from "../date.ts";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Github } from "lucide-react"
import { useEffect, useState } from "react";

type Person = {
    id: number
    name: string
    githubUrl: string
}

function Daiictid202301272() {
    const student202301272: Person = {
        id: 202301272,
        name: "Dhruv Jain",
        githubUrl: "https://github.com/dhruvkjain",
    };

    const [res202301272, setRes202301272] = useState<CardDetails | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await sendDAIICTid(student202301272.id);
                setRes202301272(response);
            } catch (error) {
                setRes202301272({ error: "Failed to fetch data" });
            }
        };
        fetchData();
    }, [student202301272.id]);

    useEffect(() => {
        if (res202301272) {
            if (res202301272.error) {
                const { dateString } = date();
                toast(res202301272.error, {
                    description: dateString,
                });
            } else {
                const { dateString } = date();
                toast(res202301272.success, {
                    description: dateString,
                });
            }
        }
    }, [res202301272]);

    return res202301272 && !res202301272.error ? (
        <Card key={student202301272.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                    <AvatarFallback>
                        {student202301272.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <CardTitle>{student202301272.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">ID: {student202301272.id}</p>
                <a
                    href={student202301272.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                    <Github size={16} />
                    GitHub Profile
                </a>
            </CardContent>
        </Card>
    ) : null;
}

export {
    Daiictid202301272
}