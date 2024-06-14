export default function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return <div className="h-content">{children}</div>
}
