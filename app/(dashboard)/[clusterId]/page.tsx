"use client";
import { SidebarNav } from "@/components/side-nav";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCluster } from "@/lib/context/cluster-context";

export default function ClusterPage() {
  const { databases } = useCluster();
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[79vh]">
      <ResizablePanel defaultSize={15} className="min-w-[10vw]">
        <SidebarNav type="database" items={databases} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}></ResizablePanel>
    </ResizablePanelGroup>
  );
}
