import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Play, RotateCcw, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

interface LiveCodeEditorProps {
  initialCode: string;
  language?: string;
  title?: string;
}

const LiveCodeEditor = ({ initialCode, language = "typescript", title = "Live Code Editor" }: LiveCodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      // Capture console.log outputs
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute the code (basic evaluation for demo)
      const result = eval(code);
      
      console.log = originalLog;
      
      const outputText = logs.length > 0 ? logs.join('\n') : (result !== undefined ? String(result) : 'Code executed successfully!');
      setOutput(outputText);
      toast.success("Code executed successfully!");
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      toast.error("Code execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    toast.info("Code reset to original");
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`border-primary/20 bg-card/50 backdrop-blur transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyCode}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={resetCode}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="gradient" size="sm" onClick={runCode} disabled={isRunning}>
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`border border-border rounded-lg overflow-hidden ${isExpanded ? 'h-[50vh]' : 'h-64'}`}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>
        
        {output && (
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Output</div>
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveCodeEditor;
