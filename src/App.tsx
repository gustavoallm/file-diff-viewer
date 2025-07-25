import { DiffViewer } from "@/components/DiffViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy, FileText, GitCompare, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";

const DEMO_FILE_1 = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  getTotal() {
    return calculateTotal(this.items);
  }
}`;

const DEMO_FILE_2 = `function calculateTotal(items, taxRate = 0) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * taxRate;
  return subtotal + tax;
}

class ShoppingCart {
  constructor() {
    this.items = [];
    this.discountCode = null;
  }

  addItem(item) {
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      this.items.push({...item, quantity: item.quantity || 1});
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  applyDiscount(code) {
    this.discountCode = code;
  }

  getTotal() {
    return calculateTotal(this.items, 0.08);
  }
}`;

function App() {
  const [file1, setFile1] = useState(DEMO_FILE_1);
  const [file2, setFile2] = useState(DEMO_FILE_2);
  const [showDiff, setShowDiff] = useState(false);

  const handleCompare = () => {
    setShowDiff(true);
  };

  const handleReset = () => {
    setFile1(DEMO_FILE_1);
    setFile2(DEMO_FILE_2);
    setShowDiff(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl px-2 py-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">File Diff Viewer</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 px-2 py-1 text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              File 1
            </Badge>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 px-2 py-1 text-xs"
            >
              <Code className="w-3 h-3 mr-1" />
              File 2
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2 text-center md:text-left">
          Compare your files with ease.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!showDiff ? (
            <>
              {/* File 1 */}
              <div className="h-[calc(100vh-12rem)]">
                <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-primary">Original File</h2>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(file1)}
                        className="border-border hover:border-primary hover:text-primary px-2 py-1 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={file1}
                      onChange={(e) => setFile1(e.target.value)}
                      placeholder="Paste your first file content here..."
                      className="flex-1 bg-muted border-border text-primary font-mono text-sm resize-none"
                    />
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <Button
                      onClick={handleCompare}
                      className="w-full bg-primary hover:bg-primary/90 text-background font-semibold text-xs py-2"
                    >
                      <GitCompare className="w-3 h-3 mr-1" />
                      Compare Files
                    </Button>
                  </div>
                </div>
              </div>

              {/* File 2 */}
              <div className="h-[calc(100vh-12rem)]">
                <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-primary">Modified File</h2>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(file2)}
                        className="border-border hover:border-primary hover:text-primary px-2 py-1 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={file2}
                      onChange={(e) => setFile2(e.target.value)}
                      placeholder="Paste your second file content here..."
                      className="flex-1 bg-muted border-border text-primary font-mono text-sm resize-none"
                    />
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full border-border hover:border-primary hover:text-primary text-xs py-2"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-full">
              {/* Back Button and Reset */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={() => setShowDiff(false)}
                  variant="outline"
                  className="border-border hover:border-primary hover:text-primary text-xs"
                >
                  ← Back to Editor
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="border-border hover:border-primary hover:text-primary text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
              <DiffViewer file1={file1} file2={file2} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
