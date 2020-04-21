<?php

	namespace App\Http\Controllers\Admin;

	use Illuminate\Http\Request;
	use App\Http\Controllers\Controller;
	use Illuminate\Support\Facades\Validator;
	use Illuminate\Validation\Rule;
	use App\Participant,App\Requirement,App\RequirementParticipant;
	use DB;

	class AdminParticipantController extends Controller
	{


		/**
		 * Show participant
		*
		* @param integer $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function getShow($id,Request $q)
		{
			$Participant = Participant::where('id',$id)->firstOrFail();
			return response()->json($Participant);
		}
		
		/**
		 * Show participant requirements details
		*
		* @param integer $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function getDetails($id,Request $q)
		{
			$Participant = Participant::where('id',$id)->firstOrFail();
			$Requirements = Requirement::with('Subject','SubSubject','Level','GeographicalScope')->whereHas('Participants',function($Participants) use($id) {
				return $Participants->where('participant_id',$id);
			})->get();
			return response()->json([
				'participant' => $Participant,
				'requirements' => $Requirements
			]);
		}

		/**
		 * Save participant
		*
		* @param mixed $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function Save($id = null,Request $q)
		{

			$validation = [
				'name' => 'required'
			];
			$validator = Validator::make($q->all(), $validation);

			if($validator->fails()) {
				return response()->json(['message' => 'invalid_fields', 'errors' => $validator->messages()]);
			}

			if ($id) {
				$Participant = Participant::where('id',$id)->firstOrFail();
			}else {
				$Participant = new Participant;
			}

			$Participant->name = $q->name;
			$Participant->save();

			return response()->json($Participant->id);
		}

		/**
		 * Delete participant
		*
		* @param integer $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function Delete($id,Request $q)
		{
			Participant::where('id',$id)->delete();
		}

		/**
		 * Show requirement
		*
		* @param integer $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function getShowRequirement($id,Request $q)
		{
			$Requirement = Requirement::where('id',$id)->with('Participants')->firstOrFail();
			return response()->json($Requirement);
		}

		/**
		 * Save requirement details
		*
		* @param mixed $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function saveRequirement($id = null,Request $q)
		{
			// Validate when the send is not editing requirement
			if (!$id) {
				$validation = [
					'selected_participants' => 'required|array'
				];
				$validator = Validator::make($q->all(), $validation);
	
				if($validator->fails()) {
					return response()->json(['message' => 'invalid_fields', 'errors' => $validator->messages()]);
				}
			}

			if ($id) {
				$Requirement = Requirement::where('id',$id)->firstOrFail();
			}else {
				$Requirement = new Requirement;
			}

			$Requirement->holy_place_id = $q->holy_place_id;
			$Requirement->subject_id = $q->subject_id;
			$Requirement->sub_subject_id = $q->sub_subject_id;
			$Requirement->level_id = $q->level_id;
			$Requirement->geographical_scope_id = $q->geographical_scope_id;
			$Requirement->business_scope = $q->business_scope;
			$Requirement->requirements = $q->requirements;
			$Requirement->updated_at = date('Y-m-d H:i:s');
			$Requirement->save();

			/* Save participants */
			
			if ($id && is_array($q->deleted_participants) && count($q->deleted_participants)) {
				$deleteParticipants = RequirementParticipant::where('requirement_id',$Requirement->id)->whereIn('participant_id',$q->deleted_participants)->delete();			
			}
			if (count($q->selected_participants)) {
				$prepareInsertParticipants = [];				
				foreach($q->selected_participants as $participant_id){
					if($participant_id){
						$prepareInsertParticipants[] = ['requirement_id' => $Requirement->id,'participant_id' => $participant_id];
					}
				}
				$RequirementParticipant = RequirementParticipant::insert($prepareInsertParticipants);
			}

			return response()->json(['message' => 'success','requirement_id' => $Requirement->id]);
		}

		/**
		 * Delete requirement
		*
		* @param integer $id
		* @param Request $q
		* @return \Illuminate\Http\JsonResponse
		*/
		public function deleteRequirement($id,Request $q)
		{
			Requirement::where('id',$id)->delete();
			RequirementParticipant::where('requirement_id',$id)->delete();
		}

		/**
		 * Print participant details
		*
		* @param integer $id
		* @param Request $q
		* @return
		*/
		public function getPrint($id,Request $q)
		{
			$filterParams = ['holy_place_id','subject_id','sub_subject_id','level_id','geographical_scope_id'];
			$filterLabels = [];
			foreach($filterParams as $Param){
				if(request()->{$Param} && request()->{$Param} != 'all'){
					switch($Param){
						case 'holy_place_id':
							$selectLabel = \App\ListOfHolyPlace::where('id',request()->{$Param})->first();
						break;
						case 'subject_id':
							$selectLabel = \App\ListOfSubject::where('id',request()->{$Param})->first();
						break;
						case 'sub_subject_id':
							$selectLabel = \App\ListOfSubSubject::where('id',request()->{$Param})->first();
						break;
						case 'level_id':
							$selectLabel = \App\ListOfLevel::where('id',request()->{$Param})->first();
						break;
						case 'geographical_scope_id':
							$selectLabel = \App\ListOfGeographicalScope::where('id',request()->{$Param})->first();
						break;
					}
					$filterLabels[$Param] = $selectLabel;
				}
			}

			$Participant = Participant::where('id',$id)->firstOrFail();
			$Requirements = \App\Requirement::whereHas('Participants',function($Participants) use($id){
				return $Participants->where('participant_id',$id);
			});
			foreach($filterParams as $Param){
				if(request()->{$Param} && request()->{$Param} != 'all'){
					$Requirements = $Requirements->where($Param,request()->{$Param});
				}
			}
			$Requirements = $Requirements->get();
	
			return \PDF::loadView('app.pdf.participant-requirements',['Requirements' => $Requirements,'Participant' => $Participant,'filterLabels' => $filterLabels,'Requirements' => $Requirements],[],[ 
          'title' => 'قائمة متطلبات '.$Participant->name, 
          'format' => 'A4-L',
          'orientation' => 'L'
        ])->stream();
		}
		


	}
