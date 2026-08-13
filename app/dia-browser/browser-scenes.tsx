import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  FileText,
  Globe2,
  History,
  LockKeyhole,
  MessageSquareText,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import type {
  BrowserSceneName,
  FeatureFragmentName,
} from "./dia-browser.data";
import styles from "./dia-browser.module.css";

function BrowserChrome({
  title,
  address,
  children,
}: {
  title: string;
  address: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.browserWindow} aria-hidden="true">
      <div className={styles.browserTopbar}>
        <div className={styles.trafficLights}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.browserTab}>
          <span>{title}</span>
          <span>×</span>
        </div>
        <button type="button" tabIndex={-1} aria-hidden="true">
          +
        </button>
      </div>
      <div className={styles.browserToolbar}>
        <span>‹</span>
        <span>›</span>
        <div className={styles.addressBar}>
          <LockKeyhole size={10} strokeWidth={1.8} />
          <span>{address}</span>
        </div>
        <MoreHorizontal size={14} />
      </div>
      <div className={styles.browserViewport}>{children}</div>
    </div>
  );
}

function DiaPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.diaPrompt}>
      <div className={styles.diaGlyph}>
        <Sparkles size={12} fill="currentColor" />
      </div>
      <span>{children}</span>
      <ArrowRight size={13} />
    </div>
  );
}

function BriefScene() {
  return (
    <BrowserChrome title="Today" address="dia://today">
      <div className={styles.sceneShell}>
        <aside className={styles.sceneSidebar}>
          <strong>Dia</strong>
          <nav>
            <span className={styles.sceneNavActive}>
              <Sparkles size={12} /> Today
            </span>
            <span>
              <Search size={12} /> Search
            </span>
            <span>
              <History size={12} /> History
            </span>
          </nav>
          <small>Spaces</small>
          <span className={styles.spaceItem}>
            <i className={styles.spaceRed} /> Atlas launch
          </span>
          <span className={styles.spaceItem}>
            <i className={styles.spaceBlue} /> Reading list
          </span>
        </aside>
        <div className={styles.briefCanvas}>
          <div className={styles.sceneDate}>Tuesday · 8:42 AM</div>
          <h3>Good morning, Maya.</h3>
          <p className={styles.sceneLead}>
            Three things are worth your attention before the 10 AM review.
          </p>
          <div className={styles.briefCards}>
            <article>
              <span className={styles.cardIndex}>01</span>
              <div>
                <strong>The launch brief changed overnight</strong>
                <p>Two audience notes were added and the timeline moved forward.</p>
              </div>
              <FileText size={14} />
            </article>
            <article>
              <span className={styles.cardIndex}>02</span>
              <div>
                <strong>Design review has one open decision</strong>
                <p>The team is split between the compact and guided flows.</p>
              </div>
              <MessageSquareText size={14} />
            </article>
            <article>
              <span className={styles.cardIndex}>03</span>
              <div>
                <strong>Your saved article connects to Atlas</strong>
                <p>The retention pattern supports the onboarding direction.</p>
              </div>
              <BookOpen size={14} />
            </article>
          </div>
          <DiaPrompt>Ask about your day…</DiaPrompt>
        </div>
      </div>
    </BrowserChrome>
  );
}

function PlanScene() {
  return (
    <BrowserChrome title="Atlas launch plan" address="workspace.local/atlas">
      <div className={styles.planScene}>
        <div className={styles.documentPane}>
          <div className={styles.documentMeta}>
            <span>ATLAS / LAUNCH</span>
            <span>Updated 9 min ago</span>
          </div>
          <h3>Launch working notes</h3>
          <div className={styles.fakeParagraph}>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.noteBlock}>
            <strong>Open question</strong>
            <p>How should the first-run experience change for smaller teams?</p>
          </div>
          <div className={styles.sourceRow}>
            <span><Globe2 size={12} /> Research synthesis</span>
            <span><FileText size={12} /> Launch brief</span>
            <span><MessageSquareText size={12} /> Team notes</span>
          </div>
        </div>
        <aside className={styles.diaPanel}>
          <div className={styles.panelHeader}>
            <span><Sparkles size={13} /> Dia</span>
            <MoreHorizontal size={14} />
          </div>
          <div className={styles.userBubble}>Turn these notes into a launch plan.</div>
          <p className={styles.answerIntro}>
            Here’s a four-part plan based on the brief, research, and open team decisions.
          </p>
          <ol className={styles.planList}>
            <li><span>1</span><div><strong>Confirm the promise</strong><small>Owner · Product</small></div><Check size={13} /></li>
            <li><span>2</span><div><strong>Test the first session</strong><small>Owner · Research</small></div><Circle size={11} /></li>
            <li><span>3</span><div><strong>Prepare launch stories</strong><small>Owner · Marketing</small></div><Circle size={11} /></li>
            <li><span>4</span><div><strong>Set the feedback loop</strong><small>Owner · Support</small></div><Circle size={11} /></li>
          </ol>
          <div className={styles.citations}>
            <span>[1] Launch brief</span><span>[2] Team notes</span><span>[3] Research</span>
          </div>
          <DiaPrompt>Ask a follow-up…</DiaPrompt>
        </aside>
      </div>
    </BrowserChrome>
  );
}

const vendors = [
  { name: "Northstar", score: "9.2", price: "$", tone: "blue" },
  { name: "Common Ground", score: "8.7", price: "$$", tone: "red" },
  { name: "Fieldwork", score: "8.4", price: "$$", tone: "yellow" },
];

function CompareScene() {
  return (
    <BrowserChrome title="Team retreat research" address="dia://compare/retreat">
      <div className={styles.compareScene}>
        <header className={styles.compareHeader}>
          <div>
            <span className={styles.sceneDate}>Comparison · 7 sources</span>
            <h3>Retreat spaces for a team of twelve</h3>
          </div>
          <button type="button" tabIndex={-1}>Share</button>
        </header>
        <div className={styles.compareGrid}>
          <div className={styles.compareLabels}>
            <span>Overall fit</span>
            <span>Travel</span>
            <span>Workshop space</span>
            <span>Quiet rooms</span>
            <span>Estimated cost</span>
          </div>
          {vendors.map((vendor, index) => (
            <article key={vendor.name}>
              <div className={`${styles.vendorThumb} ${styles[`vendor${vendor.tone}`]}`}>
                <span>{index + 1}</span>
              </div>
              <strong>{vendor.name}</strong>
              <b>{vendor.score}</b>
              <span>{index === 0 ? "1h 20m" : index === 1 ? "2h" : "45m"}</span>
              <span>{index === 2 ? "Good" : "Excellent"}</span>
              <span>{index === 1 ? "4" : "6"}</span>
              <span>{vendor.price}</span>
              <small>{index === 0 ? "Best match" : index === 1 ? "Best food" : "Easiest trip"}</small>
            </article>
          ))}
        </div>
        <div className={styles.compareFooter}>
          <span><ShieldCheck size={13} /> Details linked to original sources</span>
          <DiaPrompt>Compare something else…</DiaPrompt>
        </div>
      </div>
    </BrowserChrome>
  );
}

export function BrowserScene({ scene }: { scene: BrowserSceneName }) {
  if (scene === "plan") return <PlanScene />;
  if (scene === "compare") return <CompareScene />;
  return <BriefScene />;
}

function MemoryFragment() {
  return (
    <div className={styles.memoryFragment} aria-hidden="true">
      <div className={styles.memoryOrbit}>
        <span className={styles.memoryCore}>D</span>
        <i className={styles.memoryNodeOne}>Launch notes</i>
        <i className={styles.memoryNodeTwo}>Design review</i>
        <i className={styles.memoryNodeThree}>Market map</i>
      </div>
      <p>“What did we decide about onboarding last Thursday?”</p>
      <div className={styles.memoryAnswer}>
        You chose the guided path for new teams, with a skip option for returning users.
      </div>
    </div>
  );
}

function WritingFragment() {
  return (
    <div className={styles.writingFragment} aria-hidden="true">
      <div className={styles.miniToolbar}><span>Draft</span><span>82 words</span></div>
      <p>
        The first session should feel <del>frictionless</del> <mark>immediately useful</mark>,
        not merely faster.
      </p>
      <div className={styles.inlineSuggestion}>
        <Sparkles size={11} /> Make this more specific
      </div>
    </div>
  );
}

function TabsFragment() {
  return (
    <div className={styles.tabsFragment} aria-hidden="true">
      {["Field study", "Launch brief", "Team notes"].map((tab, index) => (
        <div key={tab}>
          <span className={styles.tabFavicon}>{index + 1}</span>
          <strong>{tab}</strong>
          <small>{index === 0 ? "research.co" : index === 1 ? "docs.local" : "messages.local"}</small>
          <Check size={12} />
        </div>
      ))}
      <p>3 pages included in this conversation</p>
    </div>
  );
}

function SkillsFragment() {
  return (
    <div className={styles.skillsFragment} aria-hidden="true">
      <div className={styles.skillCardFront}>
        <span><Star size={13} fill="currentColor" /> Weekly brief</span>
        <p>Summarize decisions, open questions, and work that needs attention.</p>
        <small>Uses selected work tabs</small>
      </div>
      <div className={styles.skillCardBack}>Review my writing</div>
      <div className={styles.skillCardLast}>Plan a research sprint</div>
    </div>
  );
}

function HistoryFragment() {
  return (
    <div className={styles.historyFragment} aria-hidden="true">
      <div className={styles.historySearch}><Search size={14} /><span>that article about quiet software</span></div>
      <div className={styles.historyResult}>
        <span className={styles.resultThumb} />
        <div><strong>Calm tools for concentrated work</strong><small>Read 11 days ago · attention.design</small></div>
      </div>
      <div className={styles.historyResult}>
        <span className={`${styles.resultThumb} ${styles.resultThumbAlt}`} />
        <div><strong>Interfaces that leave room to think</strong><small>Read 3 weeks ago · ordinary.systems</small></div>
      </div>
    </div>
  );
}

function ControlFragment() {
  return (
    <div className={styles.controlFragment} aria-hidden="true">
      <div><span><ShieldCheck size={15} /> Memory</span><button type="button" tabIndex={-1} className={styles.toggleOn}><i /></button></div>
      <div><span><Clock3 size={15} /> Temporary chat</span><button type="button" tabIndex={-1}><i /></button></div>
      <div><span><Globe2 size={15} /> Excluded sites</span><strong>4 <ChevronDown size={12} /></strong></div>
    </div>
  );
}

export function FeatureFragment({ fragment }: { fragment: FeatureFragmentName }) {
  if (fragment === "writing") return <WritingFragment />;
  if (fragment === "tabs") return <TabsFragment />;
  if (fragment === "skills") return <SkillsFragment />;
  if (fragment === "history") return <HistoryFragment />;
  if (fragment === "control") return <ControlFragment />;
  return <MemoryFragment />;
}
