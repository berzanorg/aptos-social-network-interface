import { Errors } from './errors';

/** Automatically increases the count of rows based on the content inside a textarea element. */
export function handlerAutoRows(e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) {
	if (e.key === 'Enter') e.preventDefault();

	if (e.currentTarget.clientHeight < e.currentTarget.scrollHeight) {
		e.currentTarget.rows = e.currentTarget.rows + 2;
	}
}

export function handlerOnlyAllowPaste(e: KeyboardEvent) {
	if (e.ctrlKey || e.key === 'Backspace') return;
	e.preventDefault();
	alert(Errors.OnlyUrlPastingIsAllowed);
}
