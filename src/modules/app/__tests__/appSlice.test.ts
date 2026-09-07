import { appReducer, appSliceActions, AppState } from '../appSlice';

const initial = (): AppState => appReducer(undefined, { type: '@@INIT' });

describe('appSlice', () => {
  it('starts light with no blocked users', () => {
    expect(initial()).toEqual({ theme: 'light', blockedUsers: {} });
  });

  it('sets the theme', () => {
    const state = appReducer(initial(), appSliceActions.setTheme('dark'));
    expect(state.theme).toBe('dark');
  });

  it('blocks a user', () => {
    const state = appReducer(initial(), appSliceActions.blockUser(1));
    expect(state.blockedUsers).toEqual({ 1: true });
  });

  it('blocks several users independently', () => {
    let state = appReducer(initial(), appSliceActions.blockUser(1));
    state = appReducer(state, appSliceActions.blockUser(2));
    expect(state.blockedUsers).toEqual({ 1: true, 2: true });
  });

  it('removes the key entirely when unblocking, not just its value', () => {
    const blocked = appReducer(initial(), appSliceActions.blockUser(1));
    const state = appReducer(blocked, appSliceActions.unblockUser(1));

    // `unblockUser` uses `delete` on an Immer draft. `toBeUndefined` would also
    // pass on a key set to undefined, which is not what we want here.
    expect(state.blockedUsers).not.toHaveProperty('1');
    expect(state.blockedUsers).toEqual({});
  });

  it('is a no-op when unblocking a user who was never blocked', () => {
    const state = appReducer(initial(), appSliceActions.unblockUser(99));
    expect(state.blockedUsers).toEqual({});
  });

  it('does not mutate the previous state', () => {
    const before = initial();
    appReducer(before, appSliceActions.blockUser(1));
    expect(before.blockedUsers).toEqual({});
  });
});
