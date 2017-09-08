declare module 'preact-redux' {
  import { Component, ComponentConstructor, AnyComponent } from 'preact';
  import { Dispatch } from 'redux';
  export type MapStateToProps<S, P> = (state: S) => Partial<P> & { };
  export type DefaultDispatchProps<S> = {
    dispatch: Dispatch<S>;
  };
  export type MapDispatchToProps<S, P> = (dispatch: Dispatch<S>) => P;

  function connect<GS, P, S = any>(mapStateToProps: MapStateToProps<GS, P>):
    (component: ComponentConstructor<P, S>) =>
    ComponentConstructor<Partial<P>, S>;
  
  function connect<GS, P, S = any>(mapStateToProps: MapStateToProps<GS, P>, mapDispatchToProps: MapDispatchToProps<GS, P>):
    (component: ComponentConstructor<P, S>) =>
    ComponentConstructor<Partial<P>, S>;

  export const Provider: ComponentConstructor<{ store: object }, void>;
}