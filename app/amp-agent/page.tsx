import styles from "./amp-agent.module.css";

type TerminalLine = {
  role: "you" | "agent" | "tool" | "system";
  text: string;
};

const code = {
  setup: `mkdir code-editing-agent
cd code-editing-agent
go mod init agent
touch main.go`,
  skeleton: `package main

import (
    "bufio"
    "context"
    "fmt"
    "os"

    "github.com/anthropics/anthropic-sdk-go"
)

func main() {
    client := anthropic.NewClient()
    scanner := bufio.NewScanner(os.Stdin)
    conversation := []anthropic.MessageParam{}

    for scanner.Scan() {
        userInput := scanner.Text()
        conversation = append(conversation,
            anthropic.NewUserMessage(anthropic.NewTextBlock(userInput)),
        )

        message, err := runInference(context.Background(), client, conversation)
        if err != nil {
            panic(err)
        }

        conversation = append(conversation, message.ToParam())
        fmt.Println(message.Content[0].Text)
    }
}`,
  inference: `func runInference(
    ctx context.Context,
    client anthropic.Client,
    conversation []anthropic.MessageParam,
) (*anthropic.Message, error) {
    return client.Messages.New(ctx, anthropic.MessageNewParams{
        Model:     anthropic.ModelClaudeSonnet4,
        MaxTokens: 1024,
        Messages:  conversation,
    })
}`,
  install: `go get github.com/anthropics/anthropic-sdk-go
export ANTHROPIC_API_KEY="your-key"
go run .`,
  toolTypes: `type ToolDefinition struct {
    Name        string
    Description string
    InputSchema anthropic.ToolInputSchemaParam
    Function    func(input json.RawMessage) (string, error)
}

type Agent struct {
    client       anthropic.Client
    conversation []anthropic.MessageParam
    tools        []ToolDefinition
}`,
  toolMapping: `func (a *Agent) apiTools() []anthropic.ToolUnionParam {
    tools := make([]anthropic.ToolUnionParam, 0, len(a.tools))

    for _, tool := range a.tools {
        tools = append(tools, anthropic.ToolUnionParam{
            OfTool: &anthropic.ToolParam{
                Name:        tool.Name,
                Description: anthropic.String(tool.Description),
                InputSchema: tool.InputSchema,
            },
        })
    }

    return tools
}`,
  modelWithTools: `message, err := a.client.Messages.New(ctx, anthropic.MessageNewParams{
    Model:     anthropic.ModelClaudeSonnet4,
    MaxTokens: 2048,
    Messages:  a.conversation,
    Tools:     a.apiTools(),
})`,
  readInput: `type ReadFileInput struct {
    Path string \`json:"path" jsonschema_description:"Relative path of the file to read"\`
}`,
  readTool: `func NewReadFileTool() ToolDefinition {
    return ToolDefinition{
        Name:        "read_file",
        Description: "Read the complete contents of a file in the current workspace.",
        InputSchema: GenerateSchema[ReadFileInput](),
        Function: func(raw json.RawMessage) (string, error) {
            var input ReadFileInput
            if err := json.Unmarshal(raw, &input); err != nil {
                return "", err
            }

            data, err := os.ReadFile(input.Path)
            if err != nil {
                return "", err
            }

            return string(data), nil
        },
    }
}`,
  schema: `func GenerateSchema[T any]() anthropic.ToolInputSchemaParam {
    reflector := jsonschema.Reflector{AllowAdditionalProperties: false}
    schema := reflector.Reflect(new(T))

    properties := make(map[string]any)
    for pair := schema.Properties.Oldest(); pair != nil; pair = pair.Next() {
        properties[pair.Key] = pair.Value
    }

    return anthropic.ToolInputSchemaParam{
        Properties: properties,
        Required:   schema.Required,
    }
}`,
  schemaInstall: `go get github.com/invopop/jsonschema`,
  registerRead: `agent := Agent{
    client: anthropic.NewClient(),
    tools: []ToolDefinition{
        NewReadFileTool(),
    },
}`,
  toolLoop: `func (a *Agent) Run(ctx context.Context, userInput string) error {
    a.conversation = append(a.conversation,
        anthropic.NewUserMessage(anthropic.NewTextBlock(userInput)),
    )

    for {
        message, err := a.client.Messages.New(ctx, anthropic.MessageNewParams{
            Model:     anthropic.ModelClaudeSonnet4,
            MaxTokens: 2048,
            Messages:  a.conversation,
            Tools:     a.apiTools(),
        })
        if err != nil {
            return err
        }

        a.conversation = append(a.conversation, message.ToParam())

        toolResults := a.executeToolCalls(message.Content)
        if len(toolResults) == 0 {
            printText(message.Content)
            return nil
        }

        a.conversation = append(a.conversation,
            anthropic.NewUserMessage(toolResults...),
        )
    }
}`,
  executeTools: `func (a *Agent) executeToolCalls(
    content []anthropic.ContentBlockUnion,
) []anthropic.ContentBlockParamUnion {
    results := []anthropic.ContentBlockParamUnion{}

    for _, block := range content {
        if block.Type != "tool_use" {
            continue
        }

        result, err := a.executeTool(block.Name, block.Input)
        if err != nil {
            result = "Tool error: " + err.Error()
        }

        results = append(results,
            anthropic.NewToolResultBlock(block.ID, result, err != nil),
        )
    }

    return results
}`,
  fixture: `cat > secret.txt <<'EOF'
The launch phrase is: pencils out.
EOF

go run .`,
  listInput: `type ListFilesInput struct {
    Path string \`json:"path,omitempty" jsonschema_description:"Directory to inspect; defaults to the current directory"\`
}`,
  listTool: `func NewListFilesTool() ToolDefinition {
    return ToolDefinition{
        Name:        "list_files",
        Description: "List files and folders directly inside a directory.",
        InputSchema: GenerateSchema[ListFilesInput](),
        Function: func(raw json.RawMessage) (string, error) {
            var input ListFilesInput
            if err := json.Unmarshal(raw, &input); err != nil {
                return "", err
            }
            if input.Path == "" {
                input.Path = "."
            }

            entries, err := os.ReadDir(input.Path)
            if err != nil {
                return "", err
            }

            names := make([]string, 0, len(entries))
            for _, entry := range entries {
                name := entry.Name()
                if entry.IsDir() {
                    name += "/"
                }
                names = append(names, name)
            }

            return strings.Join(names, "\n"), nil
        },
    }
}`,
  registerList: `tools: []ToolDefinition{
    NewReadFileTool(),
    NewListFilesTool(),
},`,
  editInput: `type EditFileInput struct {
    Path    string \`json:"path" jsonschema_description:"File to update"\`
    OldText string \`json:"old_text" jsonschema_description:"Exact text that must already exist"\`
    NewText string \`json:"new_text" jsonschema_description:"Replacement text"\`
}`,
  editTool: `func NewEditFileTool() ToolDefinition {
    return ToolDefinition{
        Name:        "edit_file",
        Description: "Replace one exact block of text in a file.",
        InputSchema: GenerateSchema[EditFileInput](),
        Function: func(raw json.RawMessage) (string, error) {
            var input EditFileInput
            if err := json.Unmarshal(raw, &input); err != nil {
                return "", err
            }

            return editFile(input.Path, input.OldText, input.NewText)
        },
    }
}`,
  editHelper: `func editFile(path, oldText, newText string) (string, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return "", err
    }

    source := string(data)
    matches := strings.Count(source, oldText)
    if matches == 0 {
        return "", fmt.Errorf("old_text was not found in %s", path)
    }
    if matches > 1 {
        return "", fmt.Errorf("old_text appears %d times; provide more context", matches)
    }

    updated := strings.Replace(source, oldText, newText, 1)
    if err := os.WriteFile(path, []byte(updated), 0644); err != nil {
        return "", err
    }

    return "Updated " + path, nil
}`,
  registerAll: `tools: []ToolDefinition{
    NewReadFileTool(),
    NewListFilesTool(),
    NewEditFileTool(),
},`,
  createProgram: `cat > greeting.go <<'EOF'
package main

import "fmt"

func main() {
    fmt.Println("hello from the first version")
}
EOF

go run greeting.go`,
  initialOutput: `hello from the first version`,
  updatedProgram: `package main

import "fmt"

func main() {
    fmt.Println("hello from the agent")
    fmt.Println("the file changed, then the program ran")
}`,
  finalOutput: `hello from the agent
the file changed, then the program ran`,
};

function BrandMark() {
  return (
    <span className={styles.brandMark} aria-label="Amp home">
      amp
    </span>
  );
}

function CodeBlock({
  children,
  variant = "code",
}: {
  children: string;
  variant?: "code" | "shell" | "output";
}) {
  const variantClass =
    variant === "output"
      ? styles.outputBlock
      : variant === "shell"
        ? styles.shellBlock
        : "";

  return (
    <pre className={`${styles.codeBlock} ${variantClass}`}>
      <code>{children}</code>
    </pre>
  );
}

function TerminalChat({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className={styles.terminalChat} role="group" aria-label="Terminal conversation">
      {lines.map((line, index) => (
        <div className={styles.terminalLine} data-role={line.role} key={`${line.role}-${index}`}>
          <span className={styles.terminalRole}>
            {line.role === "you"
              ? "You"
              : line.role === "agent"
                ? "Agent"
                : line.role === "tool"
                  ? "Tool"
                  : "System"}
          </span>
          <span className={styles.terminalText}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

const footerGroups = [
  {
    title: "Product",
    links: ["Start", "Sign In", "Owner’s Manual", "Models"],
  },
  {
    title: "Resources",
    links: ["Chronicle", "Pricing", "Podcast", "Press Kit"],
  },
  {
    title: "Guides",
    links: ["How to Build an Agent", "Context Management"],
  },
  {
    title: "Community",
    links: ["𝕏 @ampcode", "Amp Insiders", "YouTube"],
  },
];

export default function AmpAgentPage() {
  return (
    <main className={styles.page} id="top">
      <div className={styles.backgroundGrid} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <nav className={styles.siteNav} aria-label="Article breadcrumb">
        <a className={styles.logoLink} href="#top">
          <BrandMark />
        </a>
        <div className={styles.breadcrumb}>
          <a href="#article">Chronicle</a>
          <span className={styles.slash}>//</span>
          <span>
            <span className={styles.bracket}>[</span>Note
            <span className={styles.bracket}>]</span>{" "}
            How to Build an Agent
          </span>
        </div>
      </nav>

      <section className={styles.articleGrid} id="article">
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <p className={styles.byline}>
              Thorsten Ball <span className={styles.slash}>//</span> April 15, 2025
            </p>
            <h1>
              How <em>to</em> Build <em>an</em> Agent
            </h1>
            <p className={styles.subtitle}>or: The Emperor Has No Clothes</p>
          </header>

          <div className={styles.prose}>
            <p>
              A code-editing agent can look mysterious from the outside. It reads a
              repository, chooses commands, changes files, notices when something
              failed, and tries again without waiting for a person to spell out every
              step.
            </p>
            <p>
              The mechanism underneath is much smaller than the performance suggests.
              Give a language model a conversation, describe a handful of tools, and
              keep the conversation moving until the model stops requesting work.
            </p>
            <p>
              That does not make a polished product automatic. Reliability comes from
              careful tool descriptions, useful error messages, permission boundaries,
              and hundreds of small decisions around the central loop.
            </p>
            <p>
              But the center really is a loop. We can build a useful version in one
              file and watch each capability arrive in sequence instead of hiding it
              behind a framework.
            </p>
            <p>
              Type the examples into a fresh directory if you want the shape to become
              obvious. Reading code makes the idea understandable; running it makes the
              idea feel ordinary.
            </p>
            <p>For this walkthrough you need:</p>
            <ul>
              <li>Go installed locally</li>
              <li>an Anthropic API key available as an environment variable</li>
              <li>a disposable folder the program is allowed to inspect and edit</li>
            </ul>

            <h2>Pencils out!</h2>
            <p>
              Begin with an empty module. There is no server, database, queue, or
              orchestration layer in this version. Standard input will be our chat
              interface and the current folder will be the workspace.
            </p>
            <CodeBlock variant="shell">{code.setup}</CodeBlock>
            <p>
              The first program only needs to collect user messages, send the complete
              conversation to the model, save the response, and print the text that
              comes back.
            </p>
            <CodeBlock>{code.skeleton}</CodeBlock>
            <p>
              Keep the API call in its own function. Soon we will add tool definitions
              to the same request, but separating it now makes the change easier to see.
            </p>
            <CodeBlock>{code.inference}</CodeBlock>
            <p>
              Install the SDK, expose the API key, and run the program. At this point it
              behaves like a tiny command-line chat client.
            </p>
            <CodeBlock variant="shell">{code.install}</CodeBlock>
            <TerminalChat
              lines={[
                { role: "you", text: "What files are in this directory?" },
                {
                  role: "agent",
                  text: "I cannot inspect the directory yet. I only have the text in this conversation.",
                },
                { role: "you", text: "What would let you inspect it?" },
                {
                  role: "agent",
                  text: "A tool that can list files or read a path from the workspace.",
                },
              ]}
            />
            <p>
              The model understands the request but has no way to affect or observe the
              world. This distinction matters: intelligence in the response does not
              imply access to the machine running the program.
            </p>
            <p>
              Tools close that gap. They are ordinary functions described in a format
              the model can reason about.
            </p>

            <h2>A First Tool</h2>
            <p>
              A tool has a name, a plain-language description, an input schema, and the
              function that executes locally. The description is part of the interface;
              it tells the model when this capability is appropriate.
            </p>
            <p>
              When a model chooses a tool, it does not run the function itself. It emits
              a structured request. Our program decides whether to execute that request
              and returns the result as another conversation message.
            </p>
            <TerminalChat
              lines={[
                { role: "you", text: "Read notes.txt and tell me the first line." },
                {
                  role: "agent",
                  text: "tool_use read_file {\"path\":\"notes.txt\"}",
                },
                { role: "system", text: "The program receives a structured tool request." },
              ]}
            />
            <p>
              The next model call includes both the original tool request and the result
              produced by our function. That lets the model continue with information it
              did not have when it made the request.
            </p>
            <TerminalChat
              lines={[
                { role: "tool", text: "A small loop is enough to begin." },
                {
                  role: "agent",
                  text: "The first line says: “A small loop is enough to begin.”",
                },
              ]}
            />
            <ol>
              <li>The model decides which local capability it needs.</li>
              <li>Our application executes that capability and sends the result back.</li>
            </ol>
            <p>
              Repeat those two actions and the conversation becomes an agent loop. The
              rest of the tutorial is simply making that loop concrete.
            </p>

            <h2>
              The <code>read_file</code> tool
            </h2>
            <p>
              Start with reading because it is useful and easy to constrain. Define one
              shared shape for every tool, then let each tool own its input type and
              implementation.
            </p>
            <CodeBlock>{code.toolTypes}</CodeBlock>
            <p>
              The agent keeps the tool definitions next to its conversation. Before an
              API request, convert the local definitions into the SDK’s public tool
              format.
            </p>
            <CodeBlock>{code.toolMapping}</CodeBlock>
            <p>
              Pass those definitions with every model request. The model sees the names,
              descriptions, and JSON schemas, but the Go functions remain inside our
              process.
            </p>
            <CodeBlock>{code.modelWithTools}</CodeBlock>
            <p>
              Now describe the input for <code>read_file</code>. Keeping the path
              relative to the workspace makes the intended boundary clear, even though a
              production version should enforce that boundary with path validation.
            </p>
            <CodeBlock>{code.readInput}</CodeBlock>
            <p>
              The implementation is deliberately uninteresting. Decode JSON, read the
              path, and return either the file contents or the operating-system error.
              Useful agents need honest errors more than clever wrappers.
            </p>
            <CodeBlock>{code.readTool}</CodeBlock>
            <p>
              We can derive the input schema from the Go struct. This helper turns the
              reflected properties and required fields into the shape expected by the
              SDK.
            </p>
            <CodeBlock>{code.schema}</CodeBlock>
            <p>Install the schema package:</p>
            <CodeBlock variant="shell">{code.schemaInstall}</CodeBlock>
            <p>Then register the tool when the agent is created.</p>
            <CodeBlock>{code.registerRead}</CodeBlock>
            <p>
              If we stop here, the model can request the tool but the program still does
              not know how to respond to that request. Running it exposes the missing
              half immediately.
            </p>
            <TerminalChat
              lines={[
                { role: "you", text: "Read secret.txt." },
                { role: "agent", text: "tool_use read_file {\"path\":\"secret.txt\"}" },
                { role: "system", text: "No tool result was appended. The conversation ends early." },
              ]}
            />
            <p>
              Replace the single request-and-print flow with a loop. Each pass asks the
              model what to do next. Text ends the run; tool requests produce results and
              trigger another pass.
            </p>
            <CodeBlock>{code.toolLoop}</CodeBlock>
            <p>
              The execution helper searches the response for tool-use blocks, resolves
              each name against the registered definitions, and converts failures into
              result messages the model can read.
            </p>
            <CodeBlock>{code.executeTools}</CodeBlock>
            <p>
              Create a small fixture so the agent has something it could not have known
              from the initial prompt.
            </p>
            <CodeBlock variant="shell">{code.fixture}</CodeBlock>
            <TerminalChat
              lines={[
                { role: "you", text: "What is the launch phrase in secret.txt?" },
                { role: "agent", text: "tool_use read_file {\"path\":\"secret.txt\"}" },
                { role: "tool", text: "The launch phrase is: pencils out." },
                { role: "agent", text: "The launch phrase is “pencils out.”" },
              ]}
            />
            <p>
              Ask a follow-up without repeating the filename. Because the complete
              conversation is preserved, the model can connect the new request to the
              earlier tool result.
            </p>
            <TerminalChat
              lines={[
                { role: "you", text: "How many words are in that phrase?" },
                { role: "agent", text: "There are two words in “pencils out.”" },
              ]}
            />

            <h2>
              The <code>list_files</code> tool
            </h2>
            <p>
              Reading works when the user already knows the path. An agent also needs a
              way to discover the workspace. Add a directory-listing tool with an
              optional path that defaults to the current folder.
            </p>
            <CodeBlock>{code.listInput}</CodeBlock>
            <p>
              The implementation returns one entry per line and marks directories with
              a trailing slash. The simple text format is compact, readable, and easy for
              the model to use in a later tool call.
            </p>
            <CodeBlock>{code.listTool}</CodeBlock>
            <p>Register it beside the read tool.</p>
            <CodeBlock>{code.registerList}</CodeBlock>
            <TerminalChat
              lines={[
                { role: "you", text: "What is in this project?" },
                { role: "agent", text: "tool_use list_files {\"path\":\".\"}" },
                { role: "tool", text: "go.mod\ngo.sum\nmain.go\nsecret.txt" },
                {
                  role: "agent",
                  text: "The project contains the Go module files, main.go, and secret.txt.",
                },
              ]}
            />
            <p>
              The interesting part is not listing files. It is that the model can chain
              observations without a hard-coded workflow. A broad request can become a
              listing followed by one or more reads.
            </p>
            <TerminalChat
              lines={[
                { role: "you", text: "Find where the model name is configured." },
                { role: "agent", text: "tool_use list_files {\"path\":\".\"}" },
                { role: "tool", text: "go.mod\ngo.sum\nmain.go\nsecret.txt" },
                { role: "agent", text: "tool_use read_file {\"path\":\"main.go\"}" },
                { role: "tool", text: "... Model: anthropic.ModelClaudeSonnet4 ..." },
                { role: "agent", text: "The model is selected in main.go inside the message request." },
              ]}
            />
            <p>
              It can also inspect dependency metadata when a question points there. No
              special “understand this Go project” function is required; narrow tools
              compose into a wider capability.
            </p>
            <TerminalChat
              lines={[
                { role: "you", text: "Which external packages does this module use?" },
                { role: "agent", text: "tool_use read_file {\"path\":\"go.mod\"}" },
                { role: "tool", text: "require github.com/anthropics/anthropic-sdk-go ...\nrequire github.com/invopop/jsonschema ..." },
                { role: "agent", text: "The module depends on the Anthropic Go SDK and the JSON schema reflector." },
              ]}
            />

            <h2>Let it edit_file</h2>
            <p>
              The agent can now inspect a repository but cannot change one. An editing
              tool should be more constrained than “write arbitrary bytes.” Require the
              model to identify exact existing text and provide its replacement.
            </p>
            <CodeBlock>{code.editInput}</CodeBlock>
            <p>
              The public tool definition stays as small as the read and list tools. All
              of the safety checks live in one helper that can be tested without calling
              a model.
            </p>
            <CodeBlock>{code.editTool}</CodeBlock>
            <p>
              Reject a missing match, and reject an ambiguous match. Both errors explain
              how to make the next attempt more precise. Returning those errors to the
              model lets it inspect the file again and recover.
            </p>
            <CodeBlock>{code.editHelper}</CodeBlock>
            <p>Register the complete set:</p>
            <CodeBlock>{code.registerAll}</CodeBlock>
            <p>
              Make a tiny program to edit. Keeping the fixture visible lets us verify the
              change outside the agent’s narration.
            </p>
            <CodeBlock variant="shell">{code.createProgram}</CodeBlock>
            <CodeBlock variant="output">{code.initialOutput}</CodeBlock>
            <p>
              Ask for a concrete modification. The model first reads the file so it can
              supply an exact old string, then calls the editing tool.
            </p>
            <TerminalChat
              lines={[
                { role: "you", text: "Change the greeting so it says hello from the agent." },
                { role: "agent", text: "tool_use read_file {\"path\":\"greeting.go\"}" },
                { role: "tool", text: "package main ... fmt.Println(\"hello from the first version\")" },
                {
                  role: "agent",
                  text: "tool_use edit_file {\"path\":\"greeting.go\",\"old_text\":\"hello from the first version\",\"new_text\":\"hello from the agent\"}",
                },
                { role: "tool", text: "Updated greeting.go" },
                { role: "agent", text: "Updated the greeting in greeting.go." },
              ]}
            />
            <p>The file now contains the requested change:</p>
            <CodeBlock>{code.updatedProgram}</CodeBlock>
            <p>
              A coding agent becomes more useful when the request describes an outcome
              instead of a literal replacement. The model can inspect, decide on an edit,
              and explain what changed using the same three small tools.
            </p>
            <blockquote>
              Add a second line that confirms the file changed, then keep the program
              valid Go.
            </blockquote>
            <TerminalChat
              lines={[
                { role: "agent", text: "tool_use read_file {\"path\":\"greeting.go\"}" },
                { role: "tool", text: "package main ... fmt.Println(\"hello from the agent\")" },
                {
                  role: "agent",
                  text: "tool_use edit_file {\"path\":\"greeting.go\",\"old_text\":\"fmt.Println(\\\"hello from the agent\\\")\",\"new_text\":\"fmt.Println(\\\"hello from the agent\\\")\\n    fmt.Println(\\\"the file changed, then the program ran\\\")\"}",
                },
                { role: "tool", text: "Updated greeting.go" },
                { role: "agent", text: "Added the confirmation line and preserved valid Go syntax." },
              ]}
            />
            <p>Running the result gives us an external check:</p>
            <CodeBlock variant="shell">go run greeting.go</CodeBlock>
            <CodeBlock variant="output">{code.finalOutput}</CodeBlock>
            <p>
              The model chose the sequence, but every side effect still passed through a
              function we wrote. That is the useful security boundary: model decisions
              on one side, explicit local capabilities on the other.
            </p>

            <h2>Isn’t this amazing?</h2>
            <p>
              The program is still small. Most of it is type definitions, JSON decoding,
              and conversation bookkeeping. The part that feels agentic is the repeated
              exchange between model decisions and tool results.
            </p>
            <p>
              Add more tools and the same loop can search text, run tests, apply patches,
              or ask a person for approval. None of those capabilities require a new
              theory of agents; they require careful interfaces and sensible limits.
            </p>
            <p>
              A production implementation needs workspace isolation, timeouts, output
              limits, path validation, logging, cancellation, and permission prompts.
              Those details are not decoration. They are what turn a demonstration into
              software someone can trust.
            </p>
            <p>
              Still, the core remains visible: conversation in, model response out, tool
              calls executed, results appended, repeat. Once you can hold that loop in
              your head, the apparent magic becomes a system you can inspect and improve.
            </p>
          </div>
        </article>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerIdentity}>
          <a href="#top">
            <BrandMark />
          </a>
          <ul className={styles.legalLinks}>
            <li>
              <a href="#article" className={styles.statusLink}>
                <span>All Systems Operational</span>
                <i aria-hidden="true" />
              </a>
            </li>
            <li><a href="#article">Security</a></li>
            <li><a href="#article">Privacy Policy</a></li>
            <li><a href="#article">Terms of Service</a></li>
          </ul>
        </div>

        <div className={styles.footerLinks}>
          {footerGroups.map((group) => (
            <div className={styles.footerColumn} key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#article">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
