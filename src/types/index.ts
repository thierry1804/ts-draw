export type ElementType = 'categorie' | 'probleme' | 'etat' | 'verif' | 'action';

export interface Element {
  id: string;
  type: ElementType;
  title: string;
  parent: string | null;
  next?: string[];
  next_ok?: string;
  next_ko?: string;
  usedoc?: boolean;
}

export interface ElementsData {
  elements: Element[];
}

export interface TreeNode {
  element: Element;
  children: TreeNode[];
}

export interface ElementFormData {
  id: string;
  type: ElementType;
  title: string;
  parent: string | null;
  next: string[];
  next_ok: string;
  next_ko: string;
  usedoc: boolean;
}

export const DEFAULT_FORM_DATA: ElementFormData = {
  id: '',
  type: 'categorie',
  title: '',
  parent: null,
  next: [],
  next_ok: '',
  next_ko: '',
  usedoc: false
};

export const TYPE_COLORS = {
  categorie: 'bg-blue-500',
  probleme: 'bg-purple-500',
  etat: 'bg-amber-500',
  verif: 'bg-green-500',
  action: 'bg-red-500',
};

export const TYPE_DISPLAY_NAMES: Record<ElementType, string> = {
  categorie: 'Catégorie',
  probleme: 'Problème',
  etat: 'État',
  verif: 'Vérification',
  action: 'Action',
};