import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Equal, Minus, Plus } from "lucide-react";

interface DiffViewerProps {
  file1: string;
  file2: string;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

function computeDiff(file1: string, file2: string): DiffLine[] {
  const lines1 = file1.split("\n");
  const lines2 = file2.split("\n");

  const diff: DiffLine[] = [];
  let i = 0,
    j = 0;
  let lineNum1 = 1,
    lineNum2 = 1;

  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      // Remaining lines in file2 are additions
      diff.push({
        type: "added",
        content: lines2[j],
        lineNumber2: lineNum2++,
      });
      j++;
    } else if (j >= lines2.length) {
      // Remaining lines in file1 are removals
      diff.push({
        type: "removed",
        content: lines1[i],
        lineNumber1: lineNum1++,
      });
      i++;
    } else if (lines1[i] === lines2[j]) {
      // Lines are the same
      diff.push({
        type: "unchanged",
        content: lines1[i],
        lineNumber1: lineNum1++,
        lineNumber2: lineNum2++,
      });
      i++;
      j++;
    } else {
      // Lines are different - look ahead to find best match
      let found = false;

      // Look for line1[i] in the next few lines of file2
      for (let k = j + 1; k < Math.min(j + 5, lines2.length); k++) {
        if (lines1[i] === lines2[k]) {
          // Found match - lines2[j] to lines2[k-1] are additions
          for (let l = j; l < k; l++) {
            diff.push({
              type: "added",
              content: lines2[l],
              lineNumber2: lineNum2++,
            });
          }
          diff.push({
            type: "unchanged",
            content: lines1[i],
            lineNumber1: lineNum1++,
            lineNumber2: lineNum2++,
          });
          i++;
          j = k + 1;
          found = true;
          break;
        }
      }

      if (!found) {
        // Look for line2[j] in the next few lines of file1
        for (let k = i + 1; k < Math.min(i + 5, lines1.length); k++) {
          if (lines2[j] === lines1[k]) {
            // Found match - lines1[i] to lines1[k-1] are removals
            for (let l = i; l < k; l++) {
              diff.push({
                type: "removed",
                content: lines1[l],
                lineNumber1: lineNum1++,
              });
            }
            diff.push({
              type: "unchanged",
              content: lines2[j],
              lineNumber1: lineNum1++,
              lineNumber2: lineNum2++,
            });
            i = k + 1;
            j++;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        // No match found nearby - treat as removal + addition
        diff.push({
          type: "removed",
          content: lines1[i],
          lineNumber1: lineNum1++,
        });
        diff.push({
          type: "added",
          content: lines2[j],
          lineNumber2: lineNum2++,
        });
        i++;
        j++;
      }
    }
  }

  return diff;
}

export function DiffViewer({ file1, file2 }: DiffViewerProps) {
  const diffLines = computeDiff(file1, file2);

  const stats = diffLines.reduce(
    (acc, line) => {
      acc[line.type]++;
      return acc;
    },
    { added: 0, removed: 0, unchanged: 0 }
  );

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary">Diff Results</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              <Plus className="w-3 h-3 mr-1" />+{stats.added}
            </Badge>
            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
              <Minus className="w-3 h-3 mr-1" />-{stats.removed}
            </Badge>
            <Badge variant="secondary" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
              <Equal className="w-3 h-3 mr-1" />
              {stats.unchanged}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden">
          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
            {diffLines.map((line, index) => (
              <div
                key={index}
                className={`flex items-start border-l-2 px-4 py-1 font-mono text-sm ${
                  line.type === "added"
                    ? "bg-green-500/5 border-l-green-500 text-green-400"
                    : line.type === "removed"
                    ? "bg-red-500/5 border-l-red-500 text-red-400"
                    : "bg-transparent border-l-gray-700 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 min-w-[80px] text-gray-500 text-xs">
                  <span className="w-6 text-right">{line.lineNumber1 || "-"}</span>
                  <span className="w-6 text-right">{line.lineNumber2 || "-"}</span>
                  <span className="w-4">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                </div>
                <pre className="flex-1 whitespace-pre-wrap break-words">{line.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
