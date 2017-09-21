declare module 'linkstate' {
  import { Component } from 'preact';
  type EventHandler<E extends Event> = (ev: E) => boolean;
  type LinkState = <P, S extends object>(
    component: Component<P, S>,
    stateKey: keyof S,
    path?: string,
  ) => EventHandler<any>;
  const linkState: LinkState;
  export default linkState;
}
