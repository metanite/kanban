import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    Check,
    CheckCircle2,
    CircleDot,
    Clock3,
    Layers3,
    Plus,
    Sparkles,
    Users,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';

const previewColumns = [
    {
        title: 'To-do',
        count: 3,
        marker: 'bg-slate-300',
        tasks: [
            {
                title: 'Map the onboarding flow',
                tag: 'Planning',
                color: 'bg-violet-100 text-violet-700',
            },
            {
                title: 'Write launch checklist',
                tag: 'Content',
                color: 'bg-sky-100 text-sky-700',
            },
        ],
    },
    {
        title: 'In progress',
        count: 2,
        marker: 'bg-amber-400',
        tasks: [
            {
                title: 'Build the workspace header',
                tag: 'Design',
                color: 'bg-rose-100 text-rose-700',
            },
            {
                title: 'Connect task updates',
                tag: 'Engineering',
                color: 'bg-emerald-100 text-emerald-700',
            },
        ],
    },
    {
        title: 'Done',
        count: 8,
        marker: 'bg-emerald-500',
        tasks: [
            {
                title: 'Set up your first board',
                tag: 'Getting started',
                color: 'bg-amber-100 text-amber-700',
            },
            {
                title: 'Invite your team',
                tag: 'Team',
                color: 'bg-cyan-100 text-cyan-700',
            },
        ],
    },
];

const features = [
    {
        icon: Layers3,
        title: 'See the whole flow',
        description:
            'Keep every task visible from first idea to finished work.',
    },
    {
        icon: Users,
        title: 'Work together',
        description: 'Assign ownership and give everyone a clear next step.',
    },
    {
        icon: Clock3,
        title: 'Keep momentum',
        description: 'Move cards forward with a board that stays easy to scan.',
    },
];

export default function Welcome() {
    const { auth, name } = usePage().props;
    const appName = name || 'Kanban';

    return (
        <>
            <Head title="Organize work that moves" />
            <div className="min-h-svh overflow-hidden bg-[#f4f6f1] text-[#17211b] dark:bg-[#101411] dark:text-[#edf4ed]">
                <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        aria-label={`${appName} home`}
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-[#1f5138] text-white shadow-sm dark:bg-[#8fcea8] dark:text-[#12251a]">
                            <AppLogoIcon className="size-5 fill-current" />
                        </span>
                        <span className="text-base font-semibold tracking-tight">
                            {appName}
                        </span>
                    </Link>
                    <nav
                        className="flex items-center gap-2 text-sm font-medium"
                        aria-label="Primary navigation"
                    >
                        <a
                            href="#workflow"
                            className="hidden rounded-md px-3 py-2 text-[#607064] transition-colors hover:text-[#17211b] sm:inline-flex dark:text-[#aebcaf] dark:hover:text-white"
                        >
                            How it works
                        </a>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="group inline-flex items-center gap-2 rounded-md bg-[#1f5138] px-4 py-2.5 text-white shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-[#8fcea8] dark:text-[#12251a]"
                            >
                                Open board
                                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="hidden rounded-md px-3 py-2 text-[#607064] transition-colors hover:text-[#17211b] sm:inline-flex dark:text-[#aebcaf] dark:hover:text-white"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={register()}
                                    className="group inline-flex items-center gap-2 rounded-md bg-[#1f5138] px-4 py-2.5 text-white shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-[#8fcea8] dark:text-[#12251a]"
                                >
                                    Get started
                                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main>
                    <section className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pt-12 pb-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10 lg:pt-20 lg:pb-28">
                        <div className="max-w-xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cbd8cc] bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#39704f] uppercase dark:border-[#34483a] dark:bg-[#18231b] dark:text-[#a7d5b3]">
                                <Sparkles className="size-3.5" />
                                Work, in a better rhythm
                            </div>
                            <h1 className="max-w-2xl text-5xl leading-[0.98] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                                Move work forward, one card at a time.
                            </h1>
                            <p className="mt-6 max-w-lg text-lg leading-8 text-[#607064] dark:text-[#b7c5b8]">
                                A calm, focused Kanban workspace for turning
                                busy team plans into visible progress.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="group inline-flex h-11 items-center gap-2 rounded-md bg-[#1f5138] px-5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-[#8fcea8] dark:text-[#12251a]"
                                >
                                    {auth.user
                                        ? 'Open your board'
                                        : 'Create your board'}
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <a
                                    href="#workflow"
                                    className="inline-flex h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold text-[#486050] transition-colors hover:bg-white hover:text-[#17211b] dark:text-[#bfd0c0] dark:hover:bg-[#1d2b20] dark:hover:text-white"
                                >
                                    Explore the workflow
                                </a>
                            </div>
                            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#607064] dark:text-[#aebcaf]">
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-[#39704f] dark:text-[#a7d5b3]" />
                                    Simple by design
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-[#39704f] dark:text-[#a7d5b3]" />
                                    Built for momentum
                                </span>
                            </div>
                        </div>

                        <div className="relative min-w-0">
                            <div className="absolute -inset-4 -z-10 rounded-[2rem] border border-[#d9e2d8] bg-[#e9efe8] dark:border-[#273a2c] dark:bg-[#172119]" />
                            <div className="overflow-hidden rounded-2xl border border-[#cbd8cc] bg-[#fbfcfa] shadow-[0_24px_70px_-30px_rgba(31,81,56,0.45)] dark:border-[#34483a] dark:bg-[#172019]">
                                <div className="flex items-center justify-between border-b border-[#e2e9e2] px-4 py-3.5 dark:border-[#2b3b2e]">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-[#e4eee5] text-[#39704f] dark:bg-[#26382b] dark:text-[#a7d5b3]">
                                            <Layers3 className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                My board
                                            </p>
                                            <p className="text-[11px] text-[#7b8b7e] dark:text-[#9caf9e]">
                                                Product launch - Updated just
                                                now
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="hidden items-center -space-x-2 sm:flex">
                                            <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#fbfcfa] bg-[#e9b5a2] text-[10px] font-semibold text-[#673a2e] dark:border-[#172019]">
                                                AM
                                            </span>
                                            <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#fbfcfa] bg-[#b9d7c0] text-[10px] font-semibold text-[#2c533a] dark:border-[#172019]">
                                                JD
                                            </span>
                                            <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#fbfcfa] bg-[#d8c39d] text-[10px] font-semibold text-[#5d4923] dark:border-[#172019]">
                                                +3
                                            </span>
                                        </div>
                                        <span className="hidden h-5 w-px bg-[#e2e9e2] sm:block dark:bg-[#2b3b2e]" />
                                        <button
                                            type="button"
                                            aria-label="Add task"
                                            className="flex size-8 items-center justify-center rounded-md border border-[#d9e2d8] text-[#526457] transition-colors hover:bg-[#eef4ee] dark:border-[#34483a] dark:text-[#bfd0c0] dark:hover:bg-[#233226]"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto p-4 sm:p-5">
                                    <div className="grid min-w-[630px] grid-cols-3 gap-3">
                                        {previewColumns.map((column) => (
                                            <div
                                                key={column.title}
                                                className="rounded-lg bg-[#f1f5f1] p-2.5 dark:bg-[#1d2a20]"
                                            >
                                                <div className="mb-2.5 flex items-center justify-between px-1">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`size-2 rounded-full ${column.marker}`}
                                                        />
                                                        <span className="text-xs font-semibold">
                                                            {column.title}
                                                        </span>
                                                        <span className="text-[11px] text-[#7b8b7e] dark:text-[#9caf9e]">
                                                            {column.count}
                                                        </span>
                                                    </div>
                                                    <CircleDot className="size-3.5 text-[#9eada0]" />
                                                </div>
                                                <div className="grid gap-2">
                                                    {column.tasks.map(
                                                        (task, taskIndex) => (
                                                            <div
                                                                key={task.title}
                                                                className="rounded-md border border-[#e0e8e0] bg-white p-3 shadow-[0_2px_5px_-3px_rgba(23,33,27,0.2)] dark:border-[#34483a] dark:bg-[#253329]"
                                                            >
                                                                <p className="text-[11px] leading-4 font-semibold">
                                                                    {task.title}
                                                                </p>
                                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                                    <span
                                                                        className={`rounded px-1.5 py-1 text-[9px] font-semibold ${task.color}`}
                                                                    >
                                                                        {
                                                                            task.tag
                                                                        }
                                                                    </span>
                                                                    {taskIndex ===
                                                                    0 ? (
                                                                        <span className="flex size-5 items-center justify-center rounded-full bg-[#d6e7d8] text-[8px] font-semibold text-[#356143] dark:bg-[#38563f] dark:text-[#d0e9d4]">
                                                                            JD
                                                                        </span>
                                                                    ) : (
                                                                        <CalendarDays className="size-3.5 text-[#9eada0]" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                    {column.title ===
                                                        'Done' && (
                                                        <div className="flex items-center gap-1.5 px-1 pt-1 text-[10px] font-medium text-[#6a8b72] dark:text-[#a7d5b3]">
                                                            <Check className="size-3" />
                                                            8 tasks completed
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#e2e9e2] px-4 py-3 text-[11px] text-[#7b8b7e] dark:border-[#2b3b2e] dark:text-[#9caf9e]">
                                    <span>13 tasks across 3 stages</span>
                                    <span className="inline-flex items-center gap-1.5 text-[#39704f] dark:text-[#a7d5b3]">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />{' '}
                                        All changes saved
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="workflow"
                        className="border-y border-[#dce5dc] bg-[#edf2ec] dark:border-[#29392c] dark:bg-[#151d17]"
                    >
                        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-10 lg:py-16">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.16em] text-[#39704f] uppercase dark:text-[#a7d5b3]">
                                    A board that stays clear
                                </p>
                                <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                    Less time managing the work. More time doing
                                    it.
                                </h2>
                            </div>
                            <div className="grid gap-7 sm:grid-cols-3">
                                {features.map((feature) => (
                                    <div key={feature.title}>
                                        <feature.icon className="size-5 text-[#39704f] dark:text-[#a7d5b3]" />
                                        <h3 className="mt-4 text-sm font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-[#607064] dark:text-[#aebcaf]">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-[#738176] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 dark:text-[#94a596]">
                    <div className="flex items-center gap-2 font-medium text-[#526457] dark:text-[#c1d1c2]">
                        <AppLogoIcon className="size-4 fill-current text-[#39704f] dark:text-[#a7d5b3]" />
                        {appName}
                    </div>
                    <p>Make the next step obvious.</p>
                </footer>
            </div>
        </>
    );
}
