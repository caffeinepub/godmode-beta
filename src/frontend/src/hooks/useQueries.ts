import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OutcomeSession, UserProfile, ContextScanSnapshot, Recommendation } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ city, region, preferences }: { city: string; region: string; preferences: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(city, region, preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserSessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OutcomeSession[]>({
    queryKey: ['userSessions'],
    queryFn: async () => {
      if (!actor) return [];
      const identity = await actor.getCallerUserProfile();
      if (!identity) return [];
      // Get caller's own sessions
      const principal = (actor as any)._principal;
      return actor.getUserSessions(principal);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSession(sessionId: bigint | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OutcomeSession | null>({
    queryKey: ['session', sessionId?.toString()],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !actorFetching && sessionId !== undefined,
  });
}

export function useCreateOutcomeSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      outcome,
      timeHorizon,
      riskTolerance,
    }: {
      outcome: string;
      timeHorizon: string;
      riskTolerance: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOutcomeSession(outcome, timeHorizon, riskTolerance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
  });
}

export function useAddContextScan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, snapshot }: { sessionId: bigint; snapshot: ContextScanSnapshot }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addContextScan(sessionId, snapshot);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId.toString()] });
    },
  });
}

export function useGenerateRecommendations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, injectUncertainty }: { sessionId: bigint; injectUncertainty: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateRecommendations(sessionId, injectUncertainty);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
