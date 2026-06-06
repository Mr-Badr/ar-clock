'use client';

import Link from 'next/link';

function getTone(tone) {
  const normalizedTone = typeof tone === 'string' ? tone : 'neutral';
  return ['error', 'warning', 'neutral'].includes(normalizedTone) ? normalizedTone : 'neutral';
}

function ActionItem(props) {
  const action = props.action;
  const className = action?.primary
    ? 'status-action status-action--primary'
    : 'status-action';

  const content = (
    <>
      <span className="status-action__label">
        {action.label}
      </span>
      {action.description ? (
        <span className="status-action__description">
          {action.description}
        </span>
      ) : null}
    </>
  );

  if (action?.href) {
    return (
      <Link href={action.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action?.onClick} className={className}>
      {content}
    </button>
  );
}

export default function PageStatusState(props) {
  const tone = getTone(props.tone);
  const actions = Array.isArray(props.actions) ? props.actions.filter(Boolean) : [];
  const statusKey = typeof props.statusKey === 'string' ? props.statusKey : undefined;
  const guidanceTitle = typeof props.guidanceTitle === 'string' ? props.guidanceTitle : 'ما الذي يمكنك فعله الآن؟';
  const guidanceBody = typeof props.guidanceBody === 'string' ? props.guidanceBody : '';

  return (
    <main
      className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-6 py-16"
      data-route-status={statusKey}
    >
      <div
        className="page-status-card"
        data-tone={tone}
      >
        <div className="page-status-badge">
          {props.eyebrow}
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-normal text-primary sm:text-4xl">
          {props.title}
        </h1>
        <p className="mt-4 text-sm leading-8 text-secondary sm:text-base">
          {props.description}
        </p>
        <div className="page-status-guidance">
          <p className="text-sm font-semibold text-primary">{guidanceTitle}</p>
          <p className="mt-2 text-sm leading-7 text-secondary">
            {guidanceBody}
          </p>
        </div>
        {actions.length ? (
          <div className="page-status-actions">
            {actions.map((action) => (
              <ActionItem
                key={`${action.href || 'action'}-${action.label}`}
                action={action}
              />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
