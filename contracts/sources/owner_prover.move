module ourchive::owner_prover {
    use std::vector;
    use std::signer;
    use std::error;
    use std::string::{Self, String};
    
    use aptos_std::table::{Self, Table};
    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_token::token::{Self, TokenDataId};

    use ourchive::marketplace;

    const EINVALID_CREATOR_NICKNAME: u64 = 1;
    const EINCORRECT_PHRASE: u64 = 2;
    const EINCORRECT_IMAGE_TITLE: u64 = 3;
    const EUSER_DONOT_OWN_IMAGE: u64 = 4;

    struct OwnerProverStore has key {
        creator_report_table: Table<String, SimpleMap<String, ReportElement>>,
        user_proof_table: Table<String, vector<ProofElement>>,
    }

    struct ReportElement has store, drop {
        image: TokenDataId,
        proved: bool,
    }
    
    struct ProofElement has store, drop {
        image: TokenDataId,
        phrase: String,
    }

    fun init_module(resource_signer: &signer) {
        let account_addr = signer::address_of(resource_signer);

        if (!exists<OwnerProverStore>(account_addr)) {
            move_to(resource_signer, OwnerProverStore {
                creator_report_table: table::new(),
                user_proof_table: table::new(),
            });
        };
    }
    
    entry public fun submit_report(
        creator: &signer,
        creator_nickname: String,
        image_title: String,
        phrase: String,
    ) acquires OwnerProverStore {
        let creator_report_table = &mut borrow_global_mut<OwnerProverStore>(@ourchive).creator_report_table;

        if (!table::contains(creator_report_table, creator_nickname)) {
            table::add(creator_report_table, creator_nickname, simple_map::create());
        };

        let creator_address = signer::address_of(creator);
        let uploded_images = marketplace::get_uploaded_images(creator_address);
        let reported_image = find_image(&uploded_images, creator_address, &image_title);
        let reports = table::borrow_mut(creator_report_table, creator_nickname);
        if (!simple_map::contains_key(reports, &phrase)) {
            simple_map::add(reports, phrase, ReportElement {
                image: reported_image,
                proved: false,
            });
        };
    }

    fun find_image(images: &vector<TokenDataId>, addr: address, title: &String): TokenDataId {
        let result = token::create_token_data_id(
            addr,
            string::utf8(b""),
            string::utf8(b""),
        );
        let i = 0;

        while (i < vector::length(images)) {
            let image = vector::borrow(images, i);
            let (_, _, name) = token::get_token_data_id_fields(image);
            if (&name == title) {
                result = *image;
                break
            };
            i = i + 1;
        };
        result
    }

    entry public fun prove_ownership(
        user: &signer,
        user_nickname: String,
        creator_nickname: String,
        image_title: String,
        phrase: String,
    ) acquires OwnerProverStore {
        let owner_prover_store = borrow_global_mut<OwnerProverStore>(@ourchive);

        // Get the creator's report list
        let creator_report_table = &mut owner_prover_store.creator_report_table;
        assert!(table::contains(creator_report_table, creator_nickname), error::invalid_argument(EINVALID_CREATOR_NICKNAME));

        // Check the phrase
        let creator_report_map = table::borrow_mut(creator_report_table, creator_nickname);
        assert!(simple_map::contains_key(creator_report_map, &phrase), error::invalid_argument(EINCORRECT_PHRASE));

        // Check the image title
        let creator_report = simple_map::borrow_mut(creator_report_map, &phrase);
        let (_, _, report_image_name) = token::get_token_data_id_fields(&creator_report.image);
        assert!(report_image_name == image_title, error::invalid_argument(EINCORRECT_IMAGE_TITLE));

        // Check if the image is in the user's purchase list
        let user_address = signer::address_of(user);
        assert!(check_user_purchase_image(user_address, &creator_report.image), EUSER_DONOT_OWN_IMAGE);

        let user_proof_table = &mut owner_prover_store.user_proof_table;
        if (!table::contains(user_proof_table, user_nickname)) {
            table::add(user_proof_table, user_nickname, vector::empty<ProofElement>());
        };
        let user_proof_list = table::borrow_mut(user_proof_table, user_nickname);
        vector::push_back(user_proof_list, ProofElement {
            image: creator_report.image,
            phrase: phrase,
        });
        creator_report.proved = true;
    }

    fun check_user_purchase_image(user_address: address, image_id: &TokenDataId): bool {
        let result = false;
        let i = 0;
        let (image_creator, image_collection, image_title) = token::get_token_data_id_fields(image_id);
        let purchased_images = &marketplace::get_purchased_images(user_address);

        while (i < vector::length(purchased_images)) {
            let purchased_image = vector::borrow(purchased_images, i);
            let (creator, collection, name, _ ) = token::get_token_id_fields(purchased_image);
            if (creator == image_creator &&
                image_collection == collection &&
                image_title == name) {
                result = true;
                break
            };
            i = i + 1;
        };
        result
    }
}
