export function Table({ children }: any) { return <table className="w-full">{children}</table> }
export function TableHeader({ children }: any) { return <thead>{children}</thead> }
export function TableBody({ children }: any) { return <tbody>{children}</tbody> }
export function TableRow({ children }: any) { return <tr>{children}</tr> }
export function TableHead({ children, className='' }: any) { return <th className={className + ' text-left p-2'}>{children}</th> }
export function TableCell({ children, className='' }: any) { return <td className={className + ' p-2'}>{children}</td> }
