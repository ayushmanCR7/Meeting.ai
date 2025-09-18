import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MeetingGetOne } from "../../types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BookOpenTextIcon, ClockFadingIcon, SparkleIcon } from "lucide-react"
import Link from "next/link"
import { GeneratedAvatar } from "@/components/ui/generated-avata"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Markdown from "react-markdown"
import humanizeDuration from "humanize-duration"
interface Props {
    data: MeetingGetOne
}
function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        round: true,
        units: ["h", "m", "s"],
    });
};

export const CompletedState = ({ data }: Props) => {

    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                            <TabsTrigger value="summary" className="text-muted-foreground rounded-none bg-background data-[state=active]: shadow-none border-b-2
border-transparent data-[state=active] : border-b-primary data-[state=active]:text-accent-foreground h-full
hover:text-accent-foreground">
                                <BookOpenTextIcon />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger value="Transcript" className="text-muted-foreground rounded-none bg-background data-[state=active]: shadow-none border-b-2
border-transparent data-[state=active] : border-b-primary data-[state=active]:text-accent-foreground h-full
hover:text-accent-foreground">
                                <BookOpenTextIcon />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger value="Recording" className="text-muted-foreground rounded-none bg-background data-[state=active]: shadow-none border-b-2
border-transparent data-[state=active] : border-b-primary data-[state=active]:text-accent-foreground h-full
hover:text-accent-foreground">
                                <BookOpenTextIcon />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger value="askAi" className="text-muted-foreground rounded-none bg-background data-[state=active]: shadow-none border-b-2
border-transparent data-[state=active] : border-b-primary data-[state=active]:text-accent-foreground h-full
hover:text-accent-foreground">
                                <BookOpenTextIcon />
                                askAi
                            </TabsTrigger >
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <TabsContent value="Recording">
                    <div className="bg-white rounded-lg px-4 py-4">
                        <video src={data.recordingUrl ? data.recordingUrl : ""} className="w-full rounded-lg" controls></video>
                    </div>
                </TabsContent>
                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2x1| font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link href={`/agents/${data.agent.id}`} className="flex items-center gap-x-2 underline underline-offset-4 capitalize">
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />{data.agent.name}
                                </Link>{" "}
                                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparkleIcon className="size-4" />
                                <p>General summary</p>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                                <ClockFadingIcon className="text-blue-700" />
                                {data.duration ? formatDuration((data.duration)) : ""}
                                <div>
                                    <Markdown
                                        components={{
                                            h1: (props) => (
                                                <h1 className="text-2xl font-medium mb-6"{...props} />
                                            ),
                                            h2: (props) => (
                                                <h1 className="text-xl font-medium mb-6"{...props} />
                                            ),
                                            h3: (props) => (
                                                <h1 className="text-lg font-medium mb-6"{...props} />
                                            ),
                                            h4: (props) => (
                                                <h1 className="text-sm font-medium mb-6"{...props} />
                                            ),
                                            p: (props) => (
                                                <p className="mb-6 leading-relaxed" {...props} />
                                            ),
                                            ul: (props) => (
                                                <ul className="list-disc list-inside mb-6" {...props} />
                                            ),
                                            ol: (props) =>
                                                <ol
                                                    className="list-decimal list-inside mb-6"{...props} />

                                        }}
                                    >
                                        {data.summary}
                                    </Markdown>
                                </div>
                            </Badge>

                        </div>
                    </div>
                </TabsContent >
            </Tabs >
        </div >
    )
}