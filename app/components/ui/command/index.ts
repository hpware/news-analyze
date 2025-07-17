import type { Ref } from "vue";
import { createContext } from "reka-ui";

export { default as Command } from "../../../../components/ui/command/Command.vue";
export { default as CommandDialog } from "../../../../components/ui/command/CommandDialog.vue";
export { default as CommandEmpty } from "../../../../components/ui/command/CommandEmpty.vue";
export { default as CommandGroup } from "../../../../components/ui/command/CommandGroup.vue";
export { default as CommandInput } from "../../../../components/ui/command/CommandInput.vue";
export { default as CommandItem } from "../../../../components/ui/command/CommandItem.vue";
export { default as CommandList } from "../../../../components/ui/command/CommandList.vue";
export { default as CommandSeparator } from "../../../../components/ui/command/CommandSeparator.vue";
export { default as CommandShortcut } from "../../../../components/ui/command/CommandShortcut.vue";

export const [useCommand, provideCommandContext] = createContext<{
  allItems: Ref<Map<string, string>>;
  allGroups: Ref<Map<string, Set<string>>>;
  filterState: {
    search: string;
    filtered: {
      count: number;
      items: Map<string, number>;
      groups: Set<string>;
    };
  };
}>("Command");

export const [useCommandGroup, provideCommandGroupContext] = createContext<{
  id?: string;
}>("CommandGroup");
