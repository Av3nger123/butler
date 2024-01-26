"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SQLEditor } from "./sql-editor";
import { useTheme } from "next-themes";
import { Input } from "./ui/input";
import { Editor, Monaco } from "@monaco-editor/react";
import { DataViewTable } from "./data-view";
import * as monaco from "monaco-editor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "./ui/button";
import { Play, Save } from "lucide-react";
import { useCluster } from "@/lib/context/cluster-context";
import { getApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import useUserStore from "@/lib/store/userstore";
import { useDatabase } from "@/lib/context/database-context";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SIZE = 100;
export function SQLQuery() {
  const [page, setPage] = useState(0);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>();
  const [input, setInput] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const { theme } = useTheme();

  const cluster = useClusterStore((state) => state.cluster);
  const [account] = useUserStore((state) => [state.account]);
  const { database, tables } = useDatabase();
  const onValidate = (markers: any) => {
    if (markers.length > 0) {
      setIsValid(false);
    }
  };
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    setEditor(editor);
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model: any, position: any) => {
        const wordUntil = model.getWordUntilPosition(position);
        const filterText = wordUntil ? model.getValueInRange(wordUntil) : "";
        const range = new monaco.Range(
          position.lineNumber,
          position.column - filterText.length,
          position.lineNumber,
          position.column,
        );
        let suggestions: any[] = [];
        suggestions.push({
          label: "SELECT",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "SELECT",
          range,
          icon: "keyword",
        });
        suggestions.push({
          label: "FROM",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "FROM",
          range,
          icon: "keyword",
        });
        suggestions.push({
          label: "WHERE",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "WHERE",
          range,
          icon: "keyword",
        });
        tables?.forEach((table) => {
          suggestions.push({
            label: `"${table?.name}"`,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: `"${table?.name}"`,
            range,
            icon: "keyword",
          });
        });
        return {
          suggestions: suggestions.filter((item) =>
            model.getValueInRange(item.range).includes(filterText),
          ),
        };
      },
    });
  };

  const handleNext = () => {
    if (data.length == SIZE) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };
  const handleInputChange = (val: string | undefined) => {
    if (val) {
      setInput(val);
    }
  };

  const processQuery = useCallback((sqlQuery: string) => {
    let trimmedQuery = sqlQuery.trim();
    if (trimmedQuery == "") {
      return "";
    }
    return trimmedQuery;
  }, []);

  const handleExecuteQuery = useCallback(
    (query: string) => {
      let processedQuery = processQuery(query);
      if (processedQuery != "") {
        getApi(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/query/${cluster?.id}?db=${database}&query=${processedQuery}&page=${page}&size=${SIZE}`,
          {
            Authorization: account?.access_token,
          },
        ).then((response) => {
          if (response?.result?.length > 0) {
            setData(response?.result);
          }
        });
      }
    },
    [account?.access_token, cluster?.id, database, page, processQuery],
  );

  const handleQueryRun = () => {
    if (editor) {
      let selectedText: string = editor
        .getModel()
        .getValueInRange(editor.getSelection());
      setQuery(selectedText);
      handleExecuteQuery(selectedText);
    }
  };

  useEffect(() => {
    handleExecuteQuery(query);
  }, [handleExecuteQuery, page, query]);

  return (
    <div className="flex-column flex rounded-sm border">
      <ResizablePanelGroup direction="vertical" className="min-h-[70vh]">
        <div className="bg-background m-2 flex h-[50px] flex-row items-center gap-2 rounded-xl border p-2">
          <Button onClick={handleQueryRun} variant="secondary" size="sm">
            <Play className=" mr-2 h-4 w-4" />
            Run
          </Button>

          <Button variant="secondary" size="sm">
            <Save className=" mr-2 h-4 w-4" />
            Save as View
          </Button>
        </div>
        <ResizablePanel defaultSize={80}>
          <div className="bg-background mx-2 h-full overflow-y-auto rounded-xl border p-2">
            {tables && (
              <Editor
                language="sql"
                options={{
                  minimap: { enabled: false },
                }}
                value={input}
                height="100%"
                width="100%"
                onValidate={onValidate}
                onChange={(val, _) => handleInputChange(val)}
                theme={`${theme == "light" ? "light" : "vs-dark"}`}
                onMount={handleEditorDidMount}
              />
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle className="mt-2 border" />

        <ResizablePanel defaultSize={20}>
          <div className="bg-background m-2 h-full rounded-xl p-2">
            <DataViewTable data={data} />
          </div>
        </ResizablePanel>
        {data.length > 0 && (
          <Pagination className="flex w-full flex-row justify-end p-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={handlePrevious}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={handleNext}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
